const CronJob = require('cron').CronJob;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// Register User
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide a valid Email').isEmail(),
    check('phone_no', 'Please provide a valid Phone Number').isMobilePhone(),
    check(
      'password',
      'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
    check('confirmPassword', 'Passwords do not match!').custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          // trow error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone_no, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user)
        return res.status(400).json({ errors: [{ msg: 'User aleady exist' }] });

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // generate otp
      var uid = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < 6; i++) {
        uid += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      user = new User({
        name,
        email,
        phone_no,
        avatar,
        password,
        uid,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

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
        subject: 'Email Verification',
        text: 'That was easy!',
        html:
          '<div style =' +
          'width:100%; height:100%;  ' +
          '><h1 style=' +
          'font-weight:500>Hey, ' +
          name +
          '<br>Welcome to Foodie!</h1><h1>Thanks for Signing up on our app</h1><h3>Your Code for verification is : ' +
          uid +
          ' </h3></div><p>If this request is not made by you kindly ignore this mail.</p><p>Regards, <strong>Foodie!</strong></p>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
        var job = new CronJob(
          '*/59 * * * *',
          async () => {
            try {
              const user1 = await User.findOne({
                email,
              });
              if (user1.verify === false) {
                try {
                  await User.findOneAndDelete({
                    email: user1.email,
                  });
                } catch (er) {
                  console.log(er);
                }
              }
            } catch (e) {
              console.log(e);
            }
          },
          null,
          true,
          'America/Los_Angeles'
        );
        job.start();
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
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

module.exports = router;
