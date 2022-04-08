const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();
dotenv.config({ path: './config/.env' });
connectDB();

const PORT = process.env.PORT || 2000;

app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
