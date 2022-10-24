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

const cookieParser = require("cookie-parser")

const session = require('express-session')

const {MemoryStore} = require('express-session');


// express 바디파서 사용
app.use(express.json())
app.use(express.urlencoded({extended : true}))
// 이미지 경로 업로드로 지정
app.use("/uploads", express.static("uploads"))
// public경로 지정
app.use(express.static(__dirname + "/public"));

app.use(cookieParser('strong'))
app.use(session({
resave:false,
saveUninitialized:false,
  secret:'strong',
  store: new MemoryStore(),
  cookie:{
    secure:false,
    httpOnly:true,
  }

}))



// 페이지 가져오기
const adminPage = require("../routes/Admin.js")
const mainPage = require("../routes/index.js")
const searchPage = require("../routes/search.js")
const boardPage = require("../routes/board.js")
const detail = require("../routes/detail.js")
const lostBoardPage = require("../routes/lostBoard.js")
const lostDetail = require("../routes/lostDetail.js")
const lostSearchPage = require("../routes/lostSearchPage.js")
const createBoard = require("../routes/create.js")
const signUpPage = require("../routes/signup.js")
const {router} = require("../routes/login.js")
const idFind = require("../routes/idFind.js")
const pwFind = require("../routes/pwFind.js")
const logout = require("../routes/logout.js")
const adminLogout = require("../routes/adminLogout.js")
const slide = require("../routes/slide.js")
const comment = require("../routes/comment.js")
const del = require("../routes/delete.js")
const update = require("../routes/update.js")
const update2 = require("../routes/update2.js")
// 페이지 연결
app.use("/", mainPage)
app.use("/board" , boardPage)
app.use("/searchPage", searchPage)
app.use("/", detail)
app.use("/lostBoard", lostBoardPage)
app.use("/create", createBoard)
app.use("/signup", signUpPage)
app.use("/login", router)
app.use("/idFind", idFind)
app.use("/pwFind", pwFind)
app.use("/logout", logout)
app.use("/admin", adminPage)
app.use("/adminLogout", adminLogout)
app.use("/slide", slide)
app.use("/comment", comment)
app.use("/delete", del)
app.use("/update", update)
app.use("/update2", update2)
app.use("/", lostDetail)
app.use("/lostSearchPage", lostSearchPage)
// 서버 실행
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})
