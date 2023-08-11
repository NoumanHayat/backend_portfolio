const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

const adminSockets = []; // Store admin sockets
const userSockets = new Map(); // Store user sockets

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('identify', (userData) => {
    if (userData.type === 'admin') {
      adminSockets.push(socket);
      socket.emit('users', Array.from(userSockets.keys()));
    } else if (userData.type === 'user') {
      userSockets.set(socket.id, userData.name);
      updateAdminUsersList();
    }
  });

  socket.on('message', (data) => {
    if (adminSockets.includes(socket)) {
      const userSocket = userSockets.get(data.to);
      if (userSocket) {
        userSocket.emit('message', { from: 'admin', content: data.content });
      }
    } else if (userSockets.has(socket.id)) {
      const adminSocket = adminSockets[0]; // Assuming there's only one admin
      if (adminSocket) {
        adminSocket.emit('message', { from: socket.id, content: data.content });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (adminSockets.includes(socket)) {
      const index = adminSockets.indexOf(socket);
      if (index !== -1) {
        adminSockets.splice(index, 1);
      }
    } else if (userSockets.has(socket.id)) {
      userSockets.delete(socket.id);
      updateAdminUsersList();
    }
  });
});

function updateAdminUsersList() {
  const users = Array.from(userSockets.values());
  adminSockets.forEach((adminSocket) => {
    adminSocket.emit('users', users);
  });
}

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
