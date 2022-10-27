const express = require('express');
const router = express.Router();
const session = require('express-session')

const { LocalStorage } = require("node-localstorage");
let localStorage = new LocalStorage('./scratch')
let userID = ""
router.get("/",(req,res)=>{
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
    

     privateKey === undefined ? "" : req.headers.cookie.split("=")
    delete session[privateKey]
    userID = ""
    res.clearCookie(privateKey)
    res.redirect("/")
})

module.exports = router