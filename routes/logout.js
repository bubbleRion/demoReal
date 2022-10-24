const express = require('express');
const router = express.Router();
const session = require('express-session')

const { LocalStorage } = require("node-localstorage");
let localStorage = new LocalStorage('./scratch')

router.get("/",(req,res)=>{

    

    let privateKey = req.headers.cookie
     privateKey === undefined ? "" : req.headers.cookie.split("=")
    delete session[privateKey]

    res.clearCookie(privateKey)
    res.redirect("/")
})

module.exports = router