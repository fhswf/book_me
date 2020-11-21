const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema({
  starttime: {
    type: Number,
    default: 800,
  },
  endtime: {
    type: Number,
    default: 800,
  },
});
module.exports = mongoose.model("Times", timeSchema);
