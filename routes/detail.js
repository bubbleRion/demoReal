const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

let userID = ""
router.get("/board:id", (req, res)=>{
  // 내가 만든 쿠키를 privateKey에 저장
  let privateKey = req.headers.cookie
  if(privateKey !== undefined && privateKey !== null){
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

  
  db.query("select * from comment", (err, results)=>{
      let comment =  results.map((item)=>{
        let userComment = {
          user : "",
          comment : "",
        }
        if(item.seq == req.params.id){
          userComment.user = item.user
          userComment.comment = item.comment
        }
          return userComment
      })
      // console.log(comment)
  
      let commentText = comment.map((item)=>{
        if(item.user !== "" || item.comment !== ""){
          return `<div>${item.user === "" ? "익명" : item.user} : ${item.comment}</div>`
        }
        else{
          return ""
        }
      }).join("")



      db.query("select * from mainBoard10", (err, results)=>{
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
            result2 = `<div>이름 : ${item.name}</div>
            <div>성별 : ${item.gender}</div>
            <div>종 : ${item.breed}</div>
            <div>나이 : ${item.age}</div>
            <div>중성화 유무 : ${item.isNeutering}</div>
            <div>잃어버린 장소 : ${item.location}</div>
            <div>특이사항 : ${item.uniqueness}</div>`    
            
            if(req.params.id == item.seq){
              console.log(item.seq)
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
                    <img src="${item.image.replace("s", "s/")}" alt=""/>
                    
                    </div>
                    <div>
                      ${userID == item.userID ? `<div>
                      <form action="/update" method="post">
                      <input type="hidden" name="seq" value="${item.seq}">
                      <input type="submit" value="글 수정" class="update">
                      </form>
                    </div>
                    <div>
                      <form action="/delete" method="post">
                      <input type="hidden" name="seq" value="${item.seq}">
                      <input type="submit" value="글 삭제" class="delete">
                      </form>
                    </div>` : ""}
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
                    <div class="scroll">
                      <div class="comment">
                          ${commentText}
                      </div>
                    </div>
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
    
})

module.exports = router;