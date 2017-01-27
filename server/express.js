import express from 'express';

// Create the express application
const app = express();

app.get('*', (req, res) => {
  res.send('hi');
});

module.exports = app;
