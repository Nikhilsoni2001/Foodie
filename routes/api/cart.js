const express = require('express');
const auth = require('../../middleware/auth');
const Product = require('../../models/Product');
const router = express.Router();

const User = require('../../models/User');

// Save Cart Items
router.post('/', auth, async (req, res) => {
  let { user_id, cart } = req.body;

  if (cart.items.length === 0)
    return res.status(400).json({ msg: 'Cart is Empty!' });
  let c = {};
  c.total_price = cart.total_price;
  c.total_quantity = cart.total_quantity;
  c.items = [];
  cart.items.forEach((item) => {
    c.items.push(item);
  });

  try {
    cart = await User.findOneAndUpdate({ user_id }, { cart: c }, { new: true });
    res.status(200).json({ msg: 'Cart Saved Successfully!', cart });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Clear cart
router.put('/', auth, async (req, res) => {
  try {
    const cart = await User.findByIdAndUpdate(
      req.user.id,
      {
        cart: {
          total_quantity: 0,
          total_price: 0,
          items: [],
        },
      },
      { new: true }
    );

    res.status(200).json({ msg: 'Cart Cleared!', cart });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get Cart
router.get('/', auth, async (req, res) => {
  try {
    let c = {};
    c.total_quantity = 0;
    c.total_price = 0;
    c.items = [];
    const user = await User.findById(req.user.id);
    let l = user.cart.items.length;
    let checkQuantity = 0;
    // If cart is empty
    if (l === 0) return res.status(400).send({ data: c });

    user.cart.items.forEach(async (item) => {
      const product = await Product.findOne({ name: item.name });
      if (product) {
        c.items.push(item);
        c.total_price += item.price * item.quantity;
        c.total_quantity += item.quantity;
      }
      checkQuantity++;
      if (checkQuantity == l) res.status(200).send({ data: c });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
