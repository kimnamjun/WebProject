var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');

router.get('/', function (request, response) {
    response.redirect('/');
});

router.get('/:src',function (request,response){
    var src = sanitizeHtml(request.params.src);
    console.log('images : ' + src);
    fs.readFile(`./images/${src}`, function(err,data){
        if(err){ console.log('파일 읽기 에러'); }
        else{
            response.writeHead(200,{'Content-Type':'image/jpg'});
            response.write(data);
            response.end();
        }
    });
});

module.exports = router;