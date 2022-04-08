const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ path: './config/.env' });

const PORT = process.env.PORT || 2000;

app.get('/', (req, res) => {
  res.send('YES');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
