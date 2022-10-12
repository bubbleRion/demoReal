const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);

const detailTemp = require("./template/detailTemplate.js")
router.get("/board:id", (req, res)=>{
  db.query("select * from mainBoard7", (err, results)=>{
    if(err){
      console.error(err)
    }
    // delete, update에 필요한 값
    current = req.params.id;
    let result2 = "";
      results.forEach((item, index)=>{
        console.log(item.image.replace("s" , "s/"))
        result2 = `
        <img src="${item.image === undefined ? "이미지 준비중" : item.image.replace("s" , "s/")}" style="width: 250px; height : 350px;"/>
        <table>
        <thead>
          <tr>
            <th class="topic">실종장소</th>
            <th class="">${item.findLocation}</th>
            <th class="topic">견종</th>
            <th>${item.breed}</th>
          </tr>
          <tr>
            <th class="topic">성별</th>
            <th>${item.isMale}</th>
            <th class="topic">${item.age}</th>
            <th>6개월</th>
          </tr>
          <tr>
            <th class="topic">중성화 유무</th>
            <th>${item.isNeutering}</th>
            <th class="topic">현재 위치</th>
            <th>${item.currentLocation}</th>
          </tr>
          <tr>
            <td colspan="4" id="alpha">특이 사항</td>
          </tr>
          <tr>
            <td colspan="4" id="beta">${item.uniqueness}</td>
          </tr>
        </thead>
      </table>`    
        
        if(req.params.id == item.seq){

        res.send(detailTemp(result2))
      }
    })     
  })
})
module.exports = router;