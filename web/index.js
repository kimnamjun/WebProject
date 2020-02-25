var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var helmet = require('helmet');
var hidden_data = require('./hidden_data.js');
var mysql = require('mysql');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

app.use(session({
    secret: hidden_data.session_secret,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: {
        maxAge: 1000 * 60 * 10 // 쿠키 유효기간 10분
    }
}));

var mainRouter = require('./routes/main');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var noticeRouter = require('./routes/notice');
var imagesRouter = require('./routes/images');

app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/notice', noticeRouter);
app.use('/images', imagesRouter);

app.use(function(request, response, next) {
    response.status(404).send('Sorry can\'t find that!');
});
  
app.use(function (err, request, response, next) {
    console.error(err.stack)
    response.status(500).send('Something broke!')
});
  

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});