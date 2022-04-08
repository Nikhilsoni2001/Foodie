const verify = require('jsonwebtoken/verify');
const mongoose = require('mongoose');

const ForgetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: false,
  },
});

module.exports = mongoose.model('forget', ForgetSchema);
