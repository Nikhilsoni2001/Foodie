const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  orderId: {
    type: String,
  },
  mode: {
    type: String,
    required: true,
  },
  order: {
    total_quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    total_price: {
      type: Number,
      default: 0,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  deliveryCharges: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: false,
  },
  address: {
    type: Object,
  },
  payment: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('order', OrderSchema);
