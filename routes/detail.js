const dongwookCon = require("../mysql/dongDatabase.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(dongwookCon);

const detailTemp = require("./template/detailTemplate.js")
router.get("/board:id", (req, res)=>{
  db.query("select * from mainBoard4", (err, results)=>{
    if(err){
      console.error(err)
    }
    // delete, update에 필요한 값
    current = req.params.id;
    let result2 = "";
      results.forEach((item, index)=>{
        result2 = `<table>
        <thead>
          <tr>
            <th class="topic">발견장소</th>
            <th class="">${item.seq}</th>
            <th class="topic">견종</th>
            <th>${item.head}</th>
          </tr>
          <tr>
            <th class="topic">성별</th>
            <th>여</th>
            <th class="topic">나이</th>
            <th>6개월</th>
          </tr>
          <tr>
            <th class="topic">중성화 유무</th>
            <th>${item.tag}</th>
            <th class="topic">현재 위치</th>
            <th>대덕구 보호소</th>
          </tr>
          <tr>
            <td colspan="4" id="alpha">특이 사항</td>
          </tr>
          <tr>
            <td colspan="4" id="beta">${item.main}</td>
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