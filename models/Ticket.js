const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  }

}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
