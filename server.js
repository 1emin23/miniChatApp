const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
// css dosyasının calısması için server'da static dosya olarak belirtmeliyiz
app.use(express.static("public"));
app.use(cors());

// Server'a gelen butun mesajları json formatında messages içerisinde saklayacagız. Server resetlenene kadar o mesajlar sırasıyla burada tutulmus olucak
const messages = [];

const server = createServer(app);
const io = new Server(server);

// home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/getAllMessages", (req, res) => {
  console.log("getAllMessages route:", messages);
  res.json(messages);
});

// client'ların server'a baglantısı
io.on("connection", (socket) => {
  // chat message odasına gelen data (username + message)
  socket.on("chat message", (payload) => {
    // Server'da aynı odaya baglı olan bütün client'lara datanın gonderilmesi
    io.emit("chat message", payload);
    messages.push(payload);
    console.log("payload: ", payload, "messagesA eklendi: ", messages);
  });
  // Yeni bir kullanıcının odaya katılması
  socket.on("new user", (username) => {
    console.log(`${username} bağlandı!`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
