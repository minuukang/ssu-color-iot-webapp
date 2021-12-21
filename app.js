const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { createColorInterface } = require('./gpio');

const red = { led: 21, minus: 23, plus: 25 };
const green = { led: 26, minus: 20, plus: 19 };
const blue = { led: 16, minus: 13, plus: 12 };
const color = { r: 0, g: 0, b: 0 };

function notify () {
  const cssColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  console.log(cssColor);
  io.emit('apply', cssColor);
}

function normalizeHexColor (value) {
  return (256 + value) % 256;
}

createColorInterface(red, value => {
  color.r = normalizeHexColor(color.r + value);
  notify();
});

createColorInterface(green, value => {
  color.g = normalizeHexColor(color.g + value);
  notify();
});

createColorInterface(blue, value => {
  color.b = normalizeHexColor(color.b + value);
  notify();
});

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/view.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  notify();
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});