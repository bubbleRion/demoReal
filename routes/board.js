const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")

const mysql = require("mysql");
const db = mysql.createConnection(conn);

let userID = "";

router.get('/', (req, res) => {
  console.log(req.session.user)
  
  

  // 내가 만든 쿠키를 privateKey에 저장
  let privateKey = req.headers.cookie
  // console.log(privateKey)
  if(privateKey !== undefined){
    let [session , cookie] = privateKey.split(";");
  // cookie가 1시간이 지나면 사라지므로 undefined가 나올 수 있다. 그 때는 아이디정보가 사라지게 하기 위해 조건을 달음
  if(cookie !== undefined){
    let [connectID, userStatus] = cookie.split("=")
    // 가끔씩 cookie와 session정보의 위치가 뒤바뀌어 나오는 경우가 있다. 그 때를 위해서 아이디 제한 12자이하으로 치부하고 글자수로 구분
    if(userStatus.length <= 12){
      userID = userStatus;
    }
    else{
      // 위치가 뒤바뀌면 session에 회원정보가 담기게 되므로 세션에서 뒤에 아이디를 담아준다.
      let [, userStat] = session.split("=");
      userID = userStat;
    }
    // 쿠키 정보가 사라졌을 때의 조건
    // privateKey를 null처리 해주고 userID도 빈값으로 다시 바꾸어준다.
  }else{
    userID = "";
    res.clearCookie(privateKey)
    delete session[privateKey]
  }
}

  // console.log(userID)
     let text = `<a href="/login" class="signIn">로그인</a>`
     let writeText = `<a class="rightbt">로그인필요</a>`
    //  privateKey가 있을 때만 글쓰기 버튼 나오게 함. 추가적으로 글쓰기 페이지에서도 조건 처리를 해줘야 한다.
     if(privateKey){
        text = `<a href="/logout" class="signIn">로그아웃</a>`
        writeText = `<a href="/create" class="rightbt">글 쓰 기</a>`
      }
  let result = "";
  db.query("select * from mainBoard10", (err, results)=>{
    if(err){
      console.error(err)
    }
    // realCount의 값을 바꿔준다. 게시물 번호 마지막의 +1
    result =  results.reverse().map((item, index)=>{
      // console.log(item.image.replace("s", "s/"))
      return `<a href="board${item.seq}"><img src="${item.image.replace("s", "s/")}" alt=""/><a>
      `
    })
    let result2 = ""
    result.forEach((item)=>{
      result2 += item
    })
    // console.log(req.cookies)
       
      
    if(privateKey){
      isLogin = true
    }

    // console.log(isLogin)
// 보내준다. 데이터를 담은 html
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<link rel="stylesheet" href="board.css">
<body>
  <div id="root">
    <header>
      <!-- 맨위에 긴박스 -->
      <a href="/">Way Home</a>
      <div>
        ${text}
      </div>
      <div>
        <a href="signup">회원가입</a>
      </div>
    </header>
    <div>실종 동물 페이지</div>
    <div>
    <a href="/lostBoard">유기동물</a>
    </div>
    <div>
    ${writeText}
    </div>
    <div>
      <form action="/searchPage" method="get">
        <input class="search-txt" type="text" name="result" placeholder="검색어를 입력해 주세요">
      </form>
    </div>
    <main>
    <!-- 가운데 10개 박스감싸는 박스 -->
      ${result2}
    </main>
    <div class="left">
      <img src="../../public/board/화살표 (2).png" alt="">
    </div>
    <div class="right">
      <img src="../../public/board/화살표 (2).png" alt="">
    </div>
  </div>
</body>
</html>`)
  })
});
 
module.exports = router;