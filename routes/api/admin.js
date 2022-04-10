const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../../middleware/auth');
const config = require('config');

const User = require('../../models/User');
const Product = require('../../models/Product');
const { check, validationResult } = require('express-validator');

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.get('cloud_name'),
  api_key: config.get('api_key'),
  api_secret: config.get('api_secret'),
});

// Upload a Product
router.post(
  '/upload',
  auth,
  [
    check('name', 'Name should be atleast of 2 characters').isLength({
      min: 2,
    }),
    check('type', 'Type should be atleast of 3 characters').isLength({
      min: 3,
    }),
    check('price', 'Please provide a valid price!').isNumeric().exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { type, name, price } = req.body;

    const user = await User.findOne({ _id: req.user.id });
    if (user.role !== 'admin')
      return res
        .status(401)
        .json('Only admins are allowed to add or remove items!');

    let product = await Product.findOne({ name });
    if (product) return res.status(400).json('Product already exists!');

    const file = req.files.productImage;

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      if (err) console.error(err);

      product = new Product({
        name,
        price,
        type,
        url: result.url,
      });

      try {
        await product.save();
        res.status(200).json('Item Added Successfully!');
      } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
      }
    });
  }
);

// Get all Items
router.get('/items', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete Item
router.delete('/items/:itemId', auth, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user.role !== 'admin')
      return res
        .status(401)
        .json('Only admins are allowed to add or remove items!');

    const id = req.params.itemId;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(401).send('No such item exists');
    res.status(200).send('Item Deleted Successfully!');
  } catch (error) {
    if (error.name === 'ObjectId') {
      return res.status(401).send('Invalid Item Id');
    }
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
