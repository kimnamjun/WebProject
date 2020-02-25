module.exports = {
  MainBody:function(title, authUI){
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 메인 페이지입니다.</p>
      ${authUI}
      <br/><br/>
      <a href='/notice'>공지사항 보기</a>
    </body>
    `;
  },

  LoginBody:function(title){
    var processLink='/login/process';
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 로그인 페이지입니다.</p>  
      <a href='/'>메인 페이지로</a>
      <form action='${processLink}' method='post'>
        <p>아이디<br/><input type='text' name='user_id' placeholder='아이디'></p>
        <p>비밀번호<br/><input type='password' name='pwd' placeholder='비밀번호'></p>
        <p>
          <input type='submit' value='로그인'>
        </p>
      </form>
    </body>
    `


  },

  SignupBody:function(title){
    var processLink='/signup/process';
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 회원가입 페이지입니다.</p>  
      <a href='/'>메인 페이지로</a>
      <form action='${processLink}' method='post'>
        <p>아이디<br/><input type='text' name='user_id' placeholder='아이디'></p>
        <p>비밀번호<br/><input type='password' name='pwd' placeholder='비밀번호'></p>
        <p>비밀번호 확인<br/><input type='password' name='pwdc' placeholder='비밀번호 확인'></p>
        <p>이름<br/><input type='text' name='user_name' placeholder='이름'></p>
        <p>연락처<br/><input type='text' name='phone_number' placeholder='연락처'></p>
        <p>
          <input type='submit' value='회원가입'>
        </p>
      </form>
    </body>
    `
  },

  NoticeBody:function(title, list){
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 공지사항 페이지입니다.</p><br/>
      <a href='/notice/create'>글쓰기 페이지로 (로그인 필요)</a><br/>
      <a href='/'>메인 페이지로</a><br/><br/>
      ${list}
    </body>
    `
  },

  NoticeContentBody:function(title, content){
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 공지사항 세부 내용 페이지입니다.</p><br/>
      <a href='/notice/create'>글쓰기 페이지로 (로그인 필요)</a><br/>
      <a href='/'>메인 페이지로</a><br/>
      <a href='/notice'>글쓰기 목록으로</a><br/>
      ${content}
    </body>
    `
  },

  CreateNoticeBody:function(title, user_id){
    var processLink='/notice/process';
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 공지사항 세부 내용 페이지입니다.</p><br/>
      <a href='/notice/create'>글쓰기 페이지로 (로그인 필요)</a><br/>
      <a href='/'>메인 페이지로</a><br/><br/><br/>
      <p>작성자 : ${user_id}</p>
      <form action='${processLink}' method='post'>
        <p>제목<br/><input type='text' name='title' placeholder='제목'></p>
        <p>내용<br/><textarea name='text' placeholder='내용'></textarea></p>
        <p>
          <input type='submit' value='완료'>
        </p>
      </form>
    </body>
    `
  },

  NoticeContentTestBody:function(title, content,image){
    var img_addr = 'http://localhost:3000/images/';
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>
    <body>
      <p>여기는 공지사항 테스트 페이지입니다.</p><br/>
      <a href='/notice/create'>글쓰기 페이지로 (로그인 필요)</a><br/>
      <a href='/'>메인 페이지로</a><br/>
      <a href='/notice'>글쓰기 목록으로</a><br/>
      ${content}
      <!--<img src='/images/${image}' alt='${image}'>-->
      <img src=${img_addr}${image}' alt='${image}'>
    </body>
    `
  }
}