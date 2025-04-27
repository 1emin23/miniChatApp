const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("public"));
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (payload) => {
    io.emit("chat message", payload);
  });
  socket.on("new user", (username) => {
    console.log(`${username} bağlandı!`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
