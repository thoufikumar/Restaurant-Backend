const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  tableType: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookingTime: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } ,
  amount:{type:String,default:"paid"}
});

module.exports = mongoose.model("Table", TableSchema);
