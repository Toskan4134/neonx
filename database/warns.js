const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    MemberID: String,
    MemberTag: String,
    WarnID: String,
    Reason: String,
    WarnedBy: String,
    WarnedByTag: String,
    Date: String
})

module.exports = mongoose.model("Warns", schema)