const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  MemberID: String,
  GiveawayID: String,
  MessageID: String,
  Finished: Boolean,
  Description: String,
  Expiration: String,
  WinnersCount: String,
  Winners: [String],
  Image: String,
});

module.exports = mongoose.model("Giveaways", schema);
