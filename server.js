
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable gzip compression
app.use(compression());

// Optimize static file serving
app.use(express.static('./', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Add basic logging
app.use(morgan('tiny'));

app.use(express.json());

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
