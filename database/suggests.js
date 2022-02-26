const mongoose = require("mongoose")
const reqString = {
    required: true,
    type: String
}

const schema = new mongoose.Schema({
    _id: reqString,
    msg: reqString,
    imgURL: String,
    memberID: String
})

module.exports = mongoose.model("Suggests", schema)