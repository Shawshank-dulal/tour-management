const mongoose=require('mongoose')

const admin_users=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    password:String
})

module.exports=mongoose.model("Admin",admin_users)