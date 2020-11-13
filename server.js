// dependancie
const express = require('express');
const app = express();

// middel ware
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());
// routes
app.get('/', (req, res) => {
  res.send('hello');
});
// init port
const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
