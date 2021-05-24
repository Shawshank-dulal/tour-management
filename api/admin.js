const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const Admin=require("../models/admin_model")

const hashPwd= function hash(passwd) {
    bcrypt.hash(passwd, 10, (err, hash)=>{
        if (!err) {
            console.log("hash: " + hash)
            return hash
        }else{
            console.log("error")
        }
    })
}

const savePwd = function savePassword(username,hashed){
    const admin=new Admin({
        _id:new mongoose.Types.ObjectId,
        username:username,
        password:hashed
    })
}

const verifyPwd=function verify(passwd){
    bcrypt.compare('a',hashPwd(passwd))
    
}

module.exports={hashPwd,savePwd,verifyPwd}