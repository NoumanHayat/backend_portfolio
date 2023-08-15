// socketServer.js

const socketIo = require("socket.io");

let adminSockets = [];
let userSockets = [];
function updateAdminUsersList() {
  const users = Array.from(userSockets.values());
  adminSockets.forEach((adminSocket) => {
    adminSocket.emit("users", users);
  });
}
module.exports = function (server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      method: ["GET", "POST", "DELETE", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    console.log("admin="+adminSockets.length)
    console.log("user="+userSockets.length)
    socket.on("identify", (userData) => {
      if (userData.type == "admin") {
        console.log("Admin connected");
        adminSockets.push(socket);
        socket.emit("users", userSockets);
      } else if (userData.type == "user") {
        console.log("User connected");
        console.log(userData.type);
        userSockets.push({
          id: socket.id,
          name: userData.name,
          email: userData.email,
          conversation: [],
        });
        adminSockets.forEach((item) => {
          io.to(item.id).emit("add", {
            id: socket.id,
            name: userData.name,
            email: userData.email,
            conversation: [],
          } );
        });
        // updateAdminUsersList();
      }
    });

    socket.on("message", (data) => {
      console.log("new message");
      const foundItem = userSockets.find((item) => item.id == data.to);

      if (foundItem) {
        io.to(data.to).emit("sendMessage", { message: data.content.content });
      } else {
        socket.emit("sendMessage", "User leave");
      }
      console.log(" send message from admin");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      adminSockets = adminSockets.filter((item) => item.id !== socket.id);
      userSockets = userSockets.filter((item) => item.id !== socket.id);
      adminSockets.forEach((item) => {
        io.to(item.id).emit("remove", {socketID:socket.id} );
      });
    });

    socket.on("sendMessage", (data) => {
      console.log(data);
      adminSockets.forEach((item) => {
        io.to(item.id).emit("sendMessage", {data:data.message,to:socket.id} );
      });
    });
  });
};
