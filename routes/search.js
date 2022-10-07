const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);

let searchResultMain = []
let searchPastLog = []
router.get('/', (req, res) => {
    db.query(`select * from mainBoard4 where main like "%${req.query.result}%" or head like "%${req.query.result}%" or tag like "%${req.query.result}%";`, (err, results)=>{
        if(err){
          console.error(err)
        }
        if(req.query.result.length > 1){
        let searchResult = [];
          searchResult =  results.reverse().map((item, index)=>{
            searchResultMain.push(`<a href="/board${item.seq}"><div class="list"><div class="text">${item.seq} : ${item.head}</div></div></a>
            `)
            
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
          <link rel="stylesheet" href="/board.css">
        </head>
        <body>
          <div id="root">
            <header>
              <div class="logo">
                <a href="/"><img src="images/로고.png" alt="" class="img"></a>
              </div>
              <div class="name">
                <div><a>실종 반려 동물 개시판</a></div>
              </div>
              <div class="login">
                <button class="signUp">회원가입</button>
                <button class="signIn">로그인</button>
              </div>
            </header>
            <sidebar id="sidebar">
            <div class="search">
            <form action="/searchPage" method="get">
            <input type="search" name="result" class="inputSearch">
                <a>
                <img src="images/검색.png" alt="">
                </a>
            </form>
          </div>
            </sidebar>
            <main>
              <div id="menu">
                <button class="leftbt">유기 동물 페이지</button>
                <form action="http://localhost:8000/createboard" method="get">
                  <button class="rightbt" formaction="http://localhost:8000/createboard">글 쓰 기</button>
                </form>
              </div>
              <div id="section">
                ${searchResult2 === "" ? "<h1>검색결과가 없네요!</h1>" : searchResult2}
              </div>
              <div class="pagenation">
                <p><</p>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>></p>
              </div>
            </main>
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