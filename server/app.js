// express 연결
const express =  require("express")
// express 호출
const app = express()
// db정보 담긴 js와의 연결
const conn = require("../mysql/database.js")
// module mysql 연결
const mysql = require("mysql")
// mysql , db정보와의 연결
const db = mysql.createConnection(conn)

const {readFile} = require("fs")
// 포트번호 지정
const port = process.env.PORT || 8080


// express 바디파서 사용
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(__dirname + "/public"));

// 메인페이지 가져오기
const mainPage = require("../routes/index.js")
const searchPage = require("../routes/search.js")
const boardPage = require("../routes/board.js")
const detail = require("../routes/detail.js")
const lostBoardPage = require("../routes/lostBoard.js")
// 메인페이지 연결
app.use("/", mainPage)
app.use("/board", boardPage)
app.use("/searchPage", searchPage)
app.use("/", detail)
app.use("/lostBoard", lostBoardPage)

// 서버 실행
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})
