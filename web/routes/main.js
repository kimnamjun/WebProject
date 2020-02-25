var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var template = require('../lib/template.js');
var hidden_data = require('../hidden_data.js');

app.use(session({
    secret: hidden_data.session_secret,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: {
        maxAge: 1000 * 60 * 10 // 쿠키 유효기간 10분
    }
}));

function authUI(request, response){
    var authUI = `<a href='/login'>로그인</a> | <a href='/signup'>회원가입</a>`;
    console.log(request.session);
    if(request.session.is_logined === undefined || !(request.session.is_logined)){
        request.session.is_logined = false;
        authUI = `<a href='/login'>로그인</a> | <a href='/signup'>회원가입</a>`;
    }
    else {
        authUI = `<a href='/login/logout'>로그아웃</a> ${request.session.user_id} 님 환영합니다.`
    }
    return authUI;
}

router.get('/', function (request, response) {
    var title = `개성공간 페이지 메인`;

    var html = template.MainBody(title, authUI(request, response));
    response.send(html);
});

module.exports = router;