// server.js
const express = require('express');
const sequelize = require('./config/database');

const app = express();

app.get('/', (req, res) => {
  res.send('Server is working');
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Failed to sync database:', err));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
