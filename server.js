'use strict';

// const compression = require('compression');
const express = require('express');
// const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// app.use(compression());
// app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
