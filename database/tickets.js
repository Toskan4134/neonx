const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    ClosedBy: String,
    OpenedBy: String,
    Locked: Boolean,
    Type: String,
    Claimed: Boolean,
    ClaimedBy: String,
    Transcription: String
})

module.exports = mongoose.model("Tickets", schema)