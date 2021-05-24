const mongoose = require("mongoose")

const enquiries = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    country: String,
    city: String,
    contact_no: Number,
    package: String,
    email: String,
    no_of_people: Number,
    comments: String
})


module.exports = mongoose.model("Enquiries", enquiries)