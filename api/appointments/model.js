// Dependencies
var mongoose = require('mongoose');

// Schema
var appointmentSchema = new mongoose.Schema({
  date: Date,
  name: String,
  phone: String,
  status: Boolean
});

// Return model
module.exports = mongoose.model('Appointment', appointmentSchema);