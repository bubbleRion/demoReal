const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);
const middle = require("./template/middleWare.js")
const multer = require("multer")
const path = require("path")
let realCount = 1;

router.get("/", (req, res)=>{
    db.query("select * from mainBoard7", (err, results)=>{
        realCount = middle.realCount(results[results.length -1].seq)
    })
    res.send(`<!DOCTYPE html>
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
      <h1><a href="" style="color: black; text-decoration: none; position: absolute; right: 0; top: 20px;">글 작성 취소</a></h1>
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
    </html>`)
  })

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
    console.log(req.file);
    console.log(req.body)
    console.log("실행!");
    // console.log(req.files);
    db.query(`insert into mainBoard7(seq, findLocation, breed, isMale, age, isNeutering, currentLocation, uniqueness, image) values(${realCount}, "${body.findLocation}", "${body.breed}", "${body.isMale}", "${body.age}", "${body.isNeutering}", "${body.currentLocation}", "${body.uniqueness}", "${req.file.path}")`, (err, results)=>{
        if(err){
            console.error(err)
        }
    })
    res.send("/board")
  });


module.exports = router;