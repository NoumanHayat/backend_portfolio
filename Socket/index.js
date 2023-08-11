// socketServer.js

const socketIo = require("socket.io");

const adminSockets = []; 
const userSockets = new Map();
function updateAdminUsersList() {
  const users = Array.from(userSockets.values());
  adminSockets.forEach((adminSocket) => {
    adminSocket.emit('users', users);
  });
}
module.exports = function (server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on("test", (data) => {
      console.log("testing");
      socket.emit("request","Testing" /* … */); // emit an event to the socket
      io.emit("broadcast","Testing" /* … */);
      socket.emit("test", "Server received your message: " + data);
    });
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
};
