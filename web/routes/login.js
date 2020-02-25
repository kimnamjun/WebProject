var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql      = require('mysql');
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
    var title = `개성공간 페이지 로그인`;
    var html = template.LoginBody(title);
    response.send(html);
});

router.post('/process', function (request, response) {
    var post = request.body;
    var user_id = sanitizeHtml(post.user_id);
    var password = sanitizeHtml(post.pwd);

    connection.query(`SELECT * FROM users WHERE id=`+mysql.escape(user_id), function(err, rows, fields) {
        if(err) {
            console.log('Error while performing Query.', err);
        }
        else if(rows[0] === undefined) {
            // 로그인 실패 처리하는 프로세스
            console.log('일치하는 아이디 없음');
            response.redirect('/login');
        }
        else {
            // 로그인 성공 처리하는 프로세스
            console.log('로그인을 처리합니다.');
            var decipher = crypto.createDecipher('aes256', hidden_data.encryption_key);
            decipher.update(rows[0].password, 'hex', 'ascii');
            var decrypted_password = decipher.final('ascii');
            if(password === decrypted_password){
                console.log('로그인 처리 해야 됨');
                request.session.is_logined = true;
                request.session.user_id = user_id;
                request.session.save(function(){npm 
                    response.redirect('/');
                });
            }
            else {
                console.log('비밀번호 달라서 실패 처리 해야 됨');
                response.redirect('/login');
            }
        }
    });
});

router.get('/logout', function (request, response) {
  request.session.destroy(function(err){
    response.redirect('/');
  });
});

module.exports = router;