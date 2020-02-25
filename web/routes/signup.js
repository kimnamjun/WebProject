var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('mysql');
var sanitizeHtml = require('sanitize-html');

var hidden_data = require('../hidden_data.js');
var template = require('../lib/template.js');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : hidden_data.mysql_password,
  port     : 3306,
  database : 'web_project'
});
connection.connect();

router.get('/', function (request, response) {
    var title = `개성공간 페이지 회원가입`;
    var html = template.SignupBody(title);
    response.send(html);
});

router.get('/process', function (request, response){
    response.redirect('/signup');
});

router.post('/process', function (request, response) {
    var post = request.body;
    var user_id = sanitizeHtml(post.user_id);
    var password = sanitizeHtml(post.pwd);
    var password_confirm = sanitizeHtml(post.pwdc);
    var user_name = sanitizeHtml(post.user_name);
    var phone_number = sanitizeHtml(post.phone_number);

    if(user_id.length < 1 || user_id.length > 16){
        console.log('# 아이디 길이는 1자 이상 16자 미만으로 할 것')
        response.redirect('/signup');
    }
    else if(!hidden_data.password_regex.test(password)){
        console.log('# 비밀 번호는 8자 이상 16자 미만의 영어, 숫자, 특수기호의 조합으로 할 것')
        response.redirect('/signup');
    }
    else if(user_name.length < 1 || user_name.length > 16){
        console.log('# 이름 길이는 1자 이상 16자 미만으로 할 것')
        response.redirect('/signup');
    }
    // 전화번호 정규식?
    else if(phone_number.length < 1 || phone_number.length > 16){
        console.log('# 전화번호 길이는 1자 이상 16자 미만으로 할 것')
        response.redirect('/signup');
    }
    else if(password !== password_confirm) {
        console.log('# 비밀번호와 비밀번호 확인이 서로 다름')
        response.redirect('/signup');
    }
    else {
        var cipher = crypto.createCipher('aes256', hidden_data.encryption_key);
        cipher.update(password, 'ascii', 'hex');
        var encrypted_password = cipher.final('hex');
        connection.query(`SELECT * FROM users WHERE id=`+mysql.escape(user_id), function(err, rows, fields){
            if (err) {
                console.log('쿼리 수행 중 문제가 발생했습니다.', err);
            }
            else if(rows[0] !== undefined){
                console.log('# 그 아이디 누군가 쓰고 있음');
            }
            else {
                connection.query(`INSERT INTO users VALUES(`+mysql.escape(user_id)+`,'${encrypted_password}',`+mysql.escape(user_name)+`,`+mysql.escape(phone_number)+`)`, function(err, rows, fields){
                    if (err) {
                        console.log('쿼리 수행 중 문제가 발생했습니다.', err);
                    }
                    else {
                        response.redirect('/login');
                    }
                });
            }
        });
    }
});

module.exports = router;