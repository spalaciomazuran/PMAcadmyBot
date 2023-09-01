// https://uptimerobot.com/dashboard?ref=website-header#795196181

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hehe');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});