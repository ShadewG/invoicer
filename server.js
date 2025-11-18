const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(compression());

app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'invoice.html'));
});

app.listen(PORT, () => {
  console.log(`Invoice generator listening on port ${PORT}`);
});
