const { Message, UserStatus } = require("./models");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("diconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("customEventFromClient", (payload) => {
      console.log("payload:", payload);

      socket.emit("customEventFromServer", "from server");
    });

    socket.on("setUsername", async (payload) => {
      await UserStatus.findOrCreate({
        where: { username: payload },
        defaults: { status: "online" },
      });
    });

    socket.on("sendMessageToServer", async (payload) => {
      const findUser = await UserStatus.findOne({
        where: { username: payload.user },
      });
      await Message.create({
        UserStatusId: findUser.id,
        UserId: payload.UserId,
        username: payload.user,
        message: payload.message,
      });
      const findChat = await Message.findAll();
      io.emit("receiveMessageFromServer", findChat);
    });
  });
};
