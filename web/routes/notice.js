var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var sanitizeHtml = require('sanitize-html');
var FileStore = require('session-file-store')(session);

var multer = require('multer');
var upload = multer({dest:'uploads/', limits:{fileSize: 100*1024*1024}});
app.use(express.static('images'));

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

app.use(session({
    secret: hidden_data.session_secret,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: {
        maxAge: 1000 * 60 * 10 // 쿠키 유효기간 10분
    }
}));

router.get('/', function (request, response) {
    connection.query(`SELECT * FROM notice`,function(err, rows, fields) {
        if(err) {
            console.log('Error while performing Query.', err);
        }
        else {
            var title = `개성공간 페이지 공지사항`;
            var list = ``;
            rows.forEach(row => {
                list += `<a href='/notice/${row.num}'>${row.title}</a><br/>`;
            });
            var html = template.NoticeBody(title, list);
            response.send(html);
        }
    })
});

router.get('/process', function (request, response){
    response.redirect('/notice');
});

router.post('/process', function (request, response){
    var post = request.body;
    var input_title = sanitizeHtml(post.title);
    var input_text = sanitizeHtml(post.text);
    var user_id = request.session.user_id;

    if(input_title.length > 0 && input_text.length > 0 && user_id !== undefined){
        connection.query(`INSERT INTO notice(id, title, text) VALUES('${user_id}',`+mysql.escape(input_text)+`,`+mysql.escape(input_text)`)`,function(err, rows, fields) {
            if(err) {
                console.log('Error while performing Query.', err);
            }
            else {
                console.log('처리 완료');
                response.redirect('/notice')
            }
        })
    }
});

router.get('/create', function (request, response){
    var user_id = request.session.user_id;
    var title = `개성공간 페이지 공지사항 작성하기`;
    if(user_id === undefined){
        response.redirect('/notice');
    }
    else{
        var html = template.CreateNoticeBody(title, user_id);
        response.send(html);
    }
});



// router.get('/upload',function (request,response){
//     fs.readFile('./images/sample.jpg', function(err,data){
//         if(err){
//             console.log('넘나 슬픈 것 ㅠ');
//         }
//         else{
//             response.writeHead(200,{'Content-Type':'image/jpg'});
//             response.write(data);
//             response.end();
//         }
//     });
// });

router.get('/test', function (request, response) {
    var imageName = 'sample.jpg';

    title = `개성공간 페이지 공지사항 TEST`;
    var content = `
    <h3>이미지 테스트</h3>
    <p>이미지 들어가는거 테스트용</p>
    `;
    var html = template.NoticeContentTestBody(title, content, imageName);
    response.send(html);
});

router.get('/:num', function (request, response) {
    var num = sanitizeHtml(request.params.num);
    var regex = /[\d]/g;
    if(regex.test(num)){
        connection.query(`SELECT * FROM notice WHERE num=`+mysql.escape(num) ,function(err, rows, fields) {
            if(err) {
                console.log('Error while performing Query.', err);
            }
            else if(rows[0] === undefined) {
                console.log('해당 번호에 해당하는 데이터가 없음');
                response.status(404).send('Sorry can\'t find that!');
            }
            else {
                title = `개성공간 페이지 공지사항 ${num}번`
                var content = `
                <h3>${rows[0].title}</h3>
                <p>${rows[0].text}</p>
                `;            
                var html = template.NoticeContentBody(title, content);
                response.send(html);
            }
        })
    }
    else{
        console.log('숫자 이외의 값이 들어옴');
        response.status(404).send('Sorry can\'t find that!');
    }
});

module.exports = router;