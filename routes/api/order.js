const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Order = require('../../models/Order');
const User = require('../../models/User');

// Place a order
router.post('/', auth, async (req, res) => {
  let { method, user, cart, deliveryCharges, payment } = req.body;
  let orderId = crypto.randomBytes(16).toString('hex');
  const email = user.email;
  const name = user.name;

  // nodemailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  var mailOptions = {
    from: `${process.env.user}`,
    to: `${email}`,
    subject: 'Order Confirmation',
    text: 'That was easy!',
    html:
      'Hi, <strong>' +
      name +
      '</strong><h2>Order Successfully Placed!</h2><h3><p>Thank you for ordering from Foodie</h3> Your order id: ' +
      orderId +
      "</p><p style='text-align: left;'>Regards, <h1>Foodie</h1></>",
  };

  if (method === 'Takeaway') {
    let order = new Order({
      user: req.user.id,
      orderId,
      mode: method,
      order: cart,
      deliveryCharges,
      payment,
    });
    try {
      await order.save();

      await transporter.sendMail(mailOptions);
      let update = {
        cart: {},
      };
      await User.findOneAndUpdate({ _id: req.user.id }, update);
      res.status(200).send({ orderId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error!');
    }
  } else {
    const { address } = req.body;
    let order = new Order({
      user: req.user.id,
      address,
      orderId,
      mode: method,
      order: cart,
      deliveryCharges,
      payment,
    });

    try {
      await order.save();
      await transporter.sendMail(mailOptions);
      let update = {
        cart: {},
      };
      await User.findOneAndUpdate({ _id: req.user.id }, update);
      res.status(200).send({ orderId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error!');
    }
  }
});

// Get order by OrderId
router.get('/', async (req, res) => {
  let { orderId } = req.query;
  try {
    let current = await Order.findOne({ orderId }).populate('user');
    res.status(200).json({ current });
  } catch (error) {
    res.send(500).send('Server Error');
  }
});

// Get all Orders by UserId
router.get('/my_orders', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await Order.find({ user: user_id });
    if (!orders) return res.status(200).json('No Order Placed!');
    else res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).status('Server Error');
  }
});

module.exports = router;
