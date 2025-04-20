
const express = require('express');
const connectDB = require('./db');
const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

app.use(express.static('./'));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
