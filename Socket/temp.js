// socketServer.js

const socketIo = require("socket.io");

module.exports = function (server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("message", (data) => {
      console.log("Received:", data);
      // You can broadcast the message to other connected clients
      socket.emit("response", "Server received your message: " + data);
      // Broadcast the message to other connected clients
      socket.broadcast.emit("message", data);
    });

    socket.on("test", (data) => {
      console.log("testing");
      socket.emit("request","Testing" /* … */); // emit an event to the socket
      io.emit("broadcast","Testing" /* … */);
      socket.emit("test", "Server received your message: " + data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
