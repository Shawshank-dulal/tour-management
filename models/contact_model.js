const mongoose = require("mongoose")

const contact = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    contact_no: Number,
    email: String,
    message: String
})


module.exports = mongoose.model("Contact", contact)