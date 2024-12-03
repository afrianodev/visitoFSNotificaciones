const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const notificationRoutes = require("./routes/notifications");
const { initQueue } = require("./services/queue");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente.");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

initQueue(io);

const PORT = 3001;
server.listen(PORT, () => console.log(`Servidor corriendo en ${PORT}`));
