const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
dotenv.config({ path: './config/.env' });
connectDB();

// Init Middlewares
app.use(express.json({ extended: false }));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/cart', require('./routes/api/cart'));

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
