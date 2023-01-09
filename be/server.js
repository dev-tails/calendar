const express = require('express');
const cookieParser = require('cookie-parser');

const server = express();
const port = process.env.PORT || 8080;

server.use(cookieParser());
server.use(express.json());

server.use(express.static('../fe/public'));

server.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
