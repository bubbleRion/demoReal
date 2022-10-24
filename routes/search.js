const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);

let searchResultMain = []
let searchPastLog = []
router.get('/', (req, res) => {
  let privateKey = req.headers.cookie
     privateKey === undefined ? "" : req.headers.cookie.split("") 
     let text = `<a href="/login" class="signIn">로그인</a>`
     let writeText = `<a class="rightbt">로그인해</a>`
     if(privateKey){
        text = `<a href="/logout" class="signIn">로그아웃</a>`
        writeText = `<a href="/create" class="rightbt">글 쓰 기</a>`
      }
     
    db.query(`select * from mainBoard10 where location like "%${req.query.result}%" or breed like "%${req.query.result}%" or gender like "%${req.query.result}%" or age like "%${req.query.result}%"  or isNeutering like "%${req.query.result}%" or name like "%${req.query.result}%" or uniqueness like "%${req.query.result}%";`, (err, results)=>{
        if(err){
          console.error(err)
        }
        if(req.query.result.length > 1){
        let searchResult;
        
        console.log(results)
          
          searchResultMain = results.reverse().map((item, index)=>{
            // console.log(item.image.replace("s", "s/"))
            return `<a href="board${item.seq}"><img src="${item.image.replace("s", "s/")}" alt=""/><a>
            `
          })
            
          
        }
        // 검색기능을 구현했지만 본문 검색을 구현하지 못했다.
        // 제목의 첫글자와 제목 내용이 완전일치하면 그 값을 반환해서 출력해주었다.
    
        let searchResult2 = ""
        // console.log(searchResultMain)
    
        // 중복제거 후 게시판에 출력
        // 변수명은 나중에 고칠것
        const set = new Set(searchResultMain)
        let searchResultMain2 = [...set]
        searchResultMain2.forEach((item)=>{
          searchResult2 += item
        })
    
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
                <a href="">회원가입</a>
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
              ${searchResult2 === "" ? "<h1>검색결과 없네요!</h1>" : searchResult2}
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
        // console.log(searchResult)
        // 정보 초기화
        searchResult = []
        searchResult2 = ""
        searchResultMain = []
        if(searchPastLog.length > 1){
          let dummy = searchPastLog.shift()
        }
      })
});
 
module.exports = router;