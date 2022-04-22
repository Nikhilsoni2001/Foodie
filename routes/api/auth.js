const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const shortid = require('shortid');

const User = require('../../models/User');
const Forget = require('../../models/Forget');
const config = require('config');

// Get current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (err) {
    console.error(err);
    res.send(500).send('Server Error');
  }
});

// login user
router.post(
  '/',
  [
    check('email', 'Please provide a valid Email').isEmail(),
    check('password', 'Please enter a valid passoword').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid credentials!',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid credentials!',
            },
          ],
        });

      const payload = {
        user: {
          id: user.id,
          verified: user.verify,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 432000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.send(500).send('Server Error');
    }
  }
);

// Verify User's email address
router.post(
  '/verify',
  [check('code', 'Code must be of 6 characters!').isLength({ min: 6, max: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ uid: req.body.code });

      if (!user) return res.status(401).send('Inavalid Code!');

      if (user.verify) {
        return res
          .status(401)
          .send('<h1>You have already verified. Login in to continue.</h1>');
      } else {
        try {
          user.verify = true;
          await user.save();
          res.status(200).send('User Has Been Verified Successfully!');
        } catch (e) {
          console.error(err);
          res.send(500).send('Server Error');
        }
      }
    } catch (err) {
      console.error(err);
      res.send(500).send('Server Error');
    }
  }
);

// Resend OTP
router.post('/resend', async (req, res) => {
  // Node Mailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  var uid = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    uid += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const { email, id, name } = req.body;

  var mailOptions = {
    from: process.env.user,
    to: `${email}`,
    subject: 'Email Verification',
    text: 'That was easy!',
    html:
      '<div style =' +
      'width:100%; height:100%;  ' +
      '><h1 style=' +
      'font-weight:500>Hey, ' +
      name +
      '<br>Welcome to Foodie!</h1><h1>Thanks for Signing up on our app</h1><h3>Your Code for verification is : ' +
      uid,
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      const update = { uid: uid };
      await User.findOneAndUpdate({ _id: id }, update);
      res
        .status(200)
        .json('Verification Code sent successfully to you mail id');
    }
  });
});

// Forget Password
router.post(
  '/forget',
  [check('email', 'Please provide a valid email!').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).json('User not registered!');

      let name = user.name;
      let code = shortid.generate();
      let link = `https://foodeazy-web.herokuapp.com/forget/${code}`;

      // check if email already exists in forget table
      await Forget.findOneAndDelete({ email });

      const forget = new Forget({
        email,
        code,
      });
      await forget.save();

      // Node Mailer
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
        from: process.env.user,
        to: `${email}`,
        subject: 'Reset your password for Foodie',
        text: 'That was easy!',
        html:
          'Hi, <strong>' +
          name +
          '</strong><p>Follow this <a href=' +
          link +
          ' >Link</a> to reset your passowrd.</p><p>If this request is not made by you kindly ignore this mail.</p><p>Regards, <strong>Foodie</strong></p>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json('Reset Email Sent to your mail id');
        }
      });
    } catch (err) {
      console.error(err);
      res.send(500).send('Server Error');
    }
  }
);

// Validate Reset Code
router.get('/reset-code', async (req, res) => {
  let { code } = req.query;

  try {
    const data = await Forget.findOne({ code });
    if (!data) {
      return res.status(404).json({ msg: 'Unauthorized!' });
    }
    res.sendStatus(200);
  } catch (error) {
    return res.status(404).json({ msg: 'Unauthorized!' });
  }
});

// Update Password
router.post(
  '/update-password',
  [
    check(
      'password',
      'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { code, password } = req.body;

    try {
      const user = await Forget.findOne({ code });

      if (!user) {
        return res.status(404).send('Invalid URL!');
      }

      let email = user.email;
      const salt = await bcrypt.genSalt(10);
      let newPass = await bcrypt.hash(password, salt);
      const update = {
        password: newPass,
      };

      await User.findOneAndUpdate({ email }, update);
      await Forget.findOneAndDelete({ code });

      res.status(200).json({ msg: 'Password Updated Successfully!' });
    } catch (error) {
      console.error(error);
      res.send(500).send('Server Error');
    }
  }
);

module.exports = router;
