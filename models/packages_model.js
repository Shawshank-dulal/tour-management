const mongoose=require("mongoose")

const package=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    destination:String,
    price:Number,
    number_days:Number,
    number_nights:Number,
    hotel:String,
    image_url:String,
    description:String
})

module.exports=mongoose.model("Package",package)