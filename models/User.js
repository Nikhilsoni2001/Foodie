const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  verify: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  phone_no: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  cart: {
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
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  previous_orders: [
    {
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
          url: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = User = mongoose.model('user', UserSchema);
