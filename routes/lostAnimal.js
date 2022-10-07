
const express = require('express');
const router = express.Router();

const URL = "http://apis.data.go.kr/6300000/eventDataService/eventDataListJson"

const EncodingKEY = "aabdjVtDyODuXtGkvJfA7GEEAE%2B7oKgHMt3Vs2z1iZZy%2Fh0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg%3D%3D"


const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;

const load = async () =>{
  
}


router.get("/",(req, res)=>{
  const res = await fetch(URL + queryParams)
  const datas = await res.text()
  res.send(datas)
})
 
module.exports = router;