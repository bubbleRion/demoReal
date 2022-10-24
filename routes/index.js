const path = require("path")
const express = require('express');
const router = express.Router();

//관리자 모드
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

// const { LocalStorage } = require("node-localstorage");
// let localStorage = new LocalStorage('./scratch')


let userID = ""
router.get('/', (req, res) => {
  // let sql = `INSERT INTO mainboard10 (seq, location, breed, gender, age, isNeutering, name, uniqueness, image) VALUES (1, "봉명동", "포메", "암컷", "3살", "유", "깜순이", "이빨이 날카로워요", "이미지 준비중");`
  let privateKey = req.headers.cookie
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
    cookie = undefined
    userID = "";
    res.clearCookie(privateKey)
    delete session[privateKey]
  }
}

  console.log(userID)


     let text = `<a href="/login" class="signIn"><div>로그인</div></a>`
     if(privateKey){
      text = `<a href="/logout" class="signIn"><div>로그아웃</div></a>`
      }
      
      
      

    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="mainPage.css">
      <title>Document</title>
    </head>
    <body>
      <div id="root">
        <header>
          <a href="/" class="logo">Way Home</a>
          <div class="sign">
              ${text}
              <a href="/signup" class="sign-up"><div>회원가입</div></a>
          </div>
      </header>
        <main>
          <div id="pageSector">
            <a href="/lostBoard" id="selectPage">
              <img src="images/pngegg (3).png" alt="" id="mainImg">
              <div id="abandonment">유기 동물</div>
            </a>
            <a href="/board" id="selectPage">
              <img src="images/pngegg (3).png" alt="" id="mainImg">
              <div id="missing">실종 동물</div>
            </a>
          </div>
          <div id="introduce">
            저희 사이트는 아프고 안타까운 동물들을 보호하고<br>
            새로운 인연을 맺어주기 위해 만들어졌으며<br>
            잃어버린 소중한 반려동물을 찾기위해 만들어졌습니다.<br>
          </div>
        </main>
      </div>
    </body>
    </html>`)
});
 
module.exports = router;
