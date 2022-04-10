const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'Veg',
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('product', ProductSchema);
