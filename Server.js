const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./App");
const fs = require("fs");
const cors = require('cors');

const socketServer = require('./Socket/index');
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down..." + err);
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LOCAL;
console.clear();
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });



const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
socketServer(server);
app.use(cors({
  origin: 'https://localhost:3000'
}));