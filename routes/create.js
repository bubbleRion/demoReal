const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);
const middle = require("./template/middleWare.js")
const multer = require("multer")
const path = require("path")
let realCount = 1;
let userID = ""
router.get("/", (req, res)=>{
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
    db.query("select * from mainBoard10", (err, results)=>{
        realCount = middle.realCount(results[results.length -1].seq)
    })
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="./createboard.css">
      <title>Document</title>
    </head>
    <body>
      <div id="root">
        <!--? 각 모든 페이지가 공유하는 헤더 몇몇 필요없는 부분의 버튼을 제거하는것을 제외하고 값이 동일하다-->
        <header>
          <div class="logo">Way Home</div>
        </header>
        <main>
          <!--? 정보 작성 공간 form태그로 input테그에서 작성된 정보를 전송 DB에 저장하는 역할을 진행한다. 드래그인 드롭으로 이미지를 삽입할 공간의 할당과 등록된 이미지의 이름을 출력할 장소 구현-->
          <form action="create" method="post" enctype="multipart/form-data">
            <section id="createImgSector">
              <div id="createImg">
                <div id="drag">이미지를 드래그하여 올려놓으십시오 (최대 3장)</div>
                <div id="imgText">그림 이름.jpg</div>
                <div id="imgText">그림 이름.jpg</div>
                <input type="file" name="image" placeholder="이미지 업로드"  style="width: 700px; height : 40px">
              </div>
            </section>
          <!--? 각 name은 DB에 저장된 데이터의 이름이고 placeholder을 통해 어떤 정보를 적고 어떤 데이터 안에 저장될지 알 수 있다.-->
            <div id="createTextSector">
              <div id="createText">
                <input type="text" name="name" class="infoA" placeholder="이름">
                <input type="text" name="gender" class="infoA" placeholder="성별">
                <input type="text" name="breed" class="infoA" placeholder="견종">
                <input type="text" name="age" class="infoA" placeholder="나이">
                <input type="text" name="isNeutering" class="infoA" placeholder="중성화 유무">
                <input type="text" name="location" class="infoA" placeholder="잃어버린 곳">
                <input type="text" name="uniqueness" class="infoB" placeholder="특이사항">
                <input type="submit" id="submit" value="작성하기"></input>
                <input type="hidden" value="${realCount}">
              </div>
            </div>
          </form>
        </main>
      </div>
    </body>
    </html>`)
  })
  let axi = new Date().valueOf()
  console.log(axi)
  // 게시글 처리 과정 req로 받아서 디비에 저장을 한다. 
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        console.log(file);
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      },
    }),
  });
  
router.post("/", upload.single("image"), (req, res) => {
    let body = req.body
    console.log(req.file)
    console.log(req.file);
    console.log(req.body)
    console.log("실행!");
    console.log(req.body.seq);
    db.query(`insert into mainBoard10(seq, location, breed, gender, age, isNeutering, name, uniqueness, image, userID) values(${realCount}, "${body.location}", "${body.breed}", "${body.gender}", "${body.age}", "${body.isNeutering}", "${body.name}", "${body.uniqueness}", "${req.file.path}" , "${userID}")`, (err, results)=>{
        if(err){
            console.error(err)
        }
    })
    res.redirect("/board")
  });


module.exports = router;

`<!DOCTYPE html>
<html lang="en">
​
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
​
<body>
  <h1>글 작성하기</h1>
  <h1><a href="/board" style="color: black; text-decoration: none; position: absolute; right: 0; top: 20px;">글 작성 취소</a></h1>
  <form action="create" method="post" enctype="multipart/form-data"
    style="display: flex; justify-content : center; align-items: center; flex-direction: column;">
    <input type="text" name="findLocation" placeholder="실종장소" style="width: 700px; height : 20px"><br>
    <input type="text" name="breed" placeholder="견종" style="width: 700px; height : 20px"><br>
    <input type="text" name="isMale" placeholder="성별" style="width: 700px; height : 20px"><br>
    <input type="text" name="age" placeholder="나이" style="width: 700px; height : 20px"><br>
    <input type="text" name="isNeutering" placeholder="중성화 유무" style="width: 700px; height : 20px"><br>
    <input type="text" name="currentLocation" placeholder="사례금" style="width: 700px; height : 20px"><br>
    <textarea type="text" name="uniqueness" placeholder="특이 사항" style="width: 700px; height : 600px;"></textarea><br>
    <input type="file" name="image" placeholder="이미지 업로드"  style="width: 700px; height : 40px"><br>
    <input type="submit" style="width: 140px; height: 60px; font-size: 24px;">
  </form>
</body>
​
</html>`