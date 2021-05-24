
const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const multer = require('multer')
const fs=require('fs')
const path = require('path')

const Enquiries = require("../models/enquiries_model")
const Packages = require("../models/packages_model")
const Contact_messages=require("../models/contact_model")


const diskStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/")
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})


const app = express()
const router=express.Router()


const upload=multer({storage:diskStorage})
app.use(cors())
app.use(express.json())
var admin = require("firebase-admin");

var serviceAccount = require("./package-images-firebase-adminsdk-x0ek7-9b2d565c91.json");
const { ensureAuthenticated } = require("../config/auth")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:"gs://package-images.appspot.com"
});


app.locals.bucket = admin.storage().bucket()

router.get('/packages', (req, res) => {
    Packages.find()
        .exec()
        .then((result) => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(404).json({ error: err })
        })
})


router.post('/packages',ensureAuthenticated, upload.single('package_img'), async(req, res) => {
  fs.readFile(path.join(__dirname,".././uploads/"+req.file.originalname), async function(err, buffer){
    await app.locals.bucket.file(req.file.originalname).createWriteStream().end(buffer)
    fs.unlink(path.join(__dirname,"/uploads/"+req.file.originalname),(err)=>{})
  })
  var Nights=req.body.number_nights
      const package = new Packages({
        _id: new mongoose.Types.ObjectId,
        destination: req.body.destination,
        price: req.body.price,
        number_nights:Nights,
        number_days: req.body.number_days,
        hotel:req.body.hotel,
        image_url: req.file.originalname,
        description: req.body.description
    })
    package
        .save()
        .then(result => console.log(result))
        .catch(err => console.log(err))
    res.status(201).json({
        message:"Saving package",
        createdPackage:package
    })
})

router.get('/enquiries', (req, res) => {
    Enquiries.find()
        .exec()
        .then((result) => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(404).json({ error: err })
        })
})

router.post("/enquiries", (req, res) => {
    var start_date= req.body.start_date
    if(req.body.start_date==undefined){
        start_date=""
    }
    const enquiry = new Enquiries({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        package:req.body.package,
        country: req.body.country,
        city: req.body.city,
        contact_no: req.body.contact_no,
        email: req.body.email,
        start_date:start_date,
        no_of_people: req.body.no_of_people,
        comments: req.body.comments
    })
    enquiry
        .save()
        .then(result => console.log(result))
        .catch(err => console.log(err))
    res.status(201).json({
        message: "saving package",
        createdPackage: enquiry
    })
})

router.get('/contacts', (req, res) => {
    Contact_messages.find()
        .exec()
        .then((result) => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(404).json({ error: err })
        })
})

router.post("/contact",(req,res)=>{
    const contact = new Contact_messages({
        _id:new mongoose.Types.ObjectId,
        name: req.body.name,
        contact_no:req.body.phone,
        email:req.body.email,
        message:req.body.message
    })
    contact
    .save()
        .then(result => console.log(result))
        .catch(err => console.log(err))
    res.status(201).json({
        message: "saving contact message",
        createdPackage: contact
    })
})

router.delete("/packages/:_id",ensureAuthenticated,(req,res)=>{
    var _id=req.params._id
    if (!Packages.findById(_id)) {
        
        return res.status(400).send();
      }
      Packages.deleteOne({_id})
      .then((result)=>{res.status(200).json()})
      .catch((err)=>{console.log("error deleting"+ err)})
})

router.delete("/enquiries/:_id",ensureAuthenticated,(req,res)=>{
    var _id=req.params._id
    if (!Enquiries.findById(_id)) {     
        
        return res.status(400).send();
      }
      Enquiries.deleteOne({_id})
      .then((result)=>{res.status(200).json()})
      .catch((err)=>{console.log("error deleting"+ err)})
})

router.get("/packages/:_id",(req,res)=>{
    var _id=req.params._id
    if (!Packages.findById(_id)) {
        return res.status(400).send();
      }
      Packages.findById(_id,(error,data)=>{
          if(!error){
              res.status(200).json(data)
          }
      })
})

module.exports = router

