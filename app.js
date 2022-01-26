require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 3000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(errorHandler);

let userArr = [];
let chatArr = [];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("diconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("customEventFromClient", (payload) => {
    console.log("payload:", payload);

    socket.emit("customEventFromServer", "from server");
  });

  socket.on("setUsername", (payload) => {
    userArr.push({
      username: payload,
      status: "online",
    });
  });
  console.log(userArr);

  socket.on("sendMessageToServer", (payload) => {
    chatArr.push(payload);
    io.emit("receiveMessageFromServer", chatArr);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
