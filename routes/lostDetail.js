const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

const imageURL = "http://www.daejeon.go.kr/"
let userID = ""
router.get("/lostBoard:id", (req, res)=>{
  // 내가 만든 쿠키를 privateKey에 저장
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
    userID = "";
    res.clearCookie(privateKey)
    delete session[privateKey]
  }
}

  console.log(userID)

      db.query("select * from lostBoard", (err, results)=>{
        let text = `<a href="/login" class="signIn">로그인</a>`
        let commentInput = ""
        let writeBox = ""
          if(privateKey){
            text = `<a href="/logout" class="signIn">로그아웃</a>`
            commentInput = `<div class="wr">
        <form action="/comment" method="post">
          <input type="hidden" name="seq" value="${req.params.id}">
          <input type="text" name="comment" placeholder="댓글쓰기">
        </form>
        </div>`
          
        }
        if(err){
          console.error(err)
        }
        // delete, update에 필요한 값
        current = req.params.id;
        let result2 = "";
        
    
        
          results.forEach((item, index)=>{
            // console.log(item.image.replace("s" , "s/"))
            let adoption = ""
            if(item.adoptionStatusCd == "1"){
                adoption = "공고중"
            }
            else if(item.adoptionStatusCd == "2"){
                adoption = "입양가능"
            }
            else if(item.adoptionStatusCd == "3"){
                adoption = "입양예정"
            }
            else if(item.adoptionStatusCd == "4"){
                adoption = "입양완료"
            }
            else if(item.adoptionStatusCd == "7"){
                adoption = "주인반환"
            }
            let gender = ""
            if(item.gender == "1"){
                gender = "암컷"
            }
            else{
                gender = "수컷"
            }
            result2 = `<div>입양상태 : ${adoption}</div>
            <div>성별 : ${gender}</div>
            <div>종 : ${item.breed}</div>
            <div>나이 : ${item.age}</div>
            <div>발견장소 : ${item.foudPlace}</div>
            <div>특이사항 : ${item.memo}</div>`    
            let image = item.filePath === "" ? `<img src="/uploads/1666313512904.jpg" alt="이미지 없음"/>` : `<img src="${imageURL + item.filePath}" alt="이미지 없음"/>`
            if(req.params.id == item.animalSeq){
            res.send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
            </head>
            <link rel="stylesheet" href="./write.css">
            
            <body>
              <div id="root">
                <header>
                  <div class="logo"><a href="/">Way Home</a></div>
                  <div class="sign">
                    ${text}
                    <a href="/signup" class="sign-up">
                      <div>회원가입</div>
                    </a>
                  </div>
                </header>
                <main>
                  <section>
                    <div>
                    ${image}
                    
                    </div>
                    <div>
                    </div>
                    <div>
                      <img src="images/right-arrow.png" alt="">
                    </div>
                    <div>
                      <img src="images/right-arrow.png" alt="">
                    </div>
                  </section>
                  <article>
                    ${result2}
                    
                    ${commentInput}
                  </article>
                </main>
              </div>
            </body>
            
            </html>`)
          }
          
      })
    })
})
module.exports = router;