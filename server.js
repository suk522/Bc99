
const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch(console.error);

app.use(express.static('./'));
app.use(express.json());

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
