const express = require("express");
const fs = require("fs");
const { addToQueue } = require("../services/queue");
const router = express.Router();

const DATA_FILE = "./db/notifications.json";

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

router.get("/", (req, res) => {
  try {
    const notifications = readData();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las notificaciones" });
  }
});

// Create notification
router.post("/", (req, res) => {
  const { userId, message } = req.body;
  const notifications = readData();
  const newNotification = { id: Date.now(), userId, message, read: false };
  notifications.push(newNotification);
  writeData(notifications);

  addToQueue(newNotification);
  res.status(201).json(newNotification);
});

// Mark notification as read
router.patch("/:id/read", (req, res) => {
  const { id } = req.params;
  const notifications = readData();
  const notification = notifications.find((n) => n.id == id);
  if (!notification) return res.status(404).json({ error: "Notification not found" });

  notification.read = true;
  writeData(notifications);
  res.status(200).json(notification);
});

// Get notifications for a user
router.get("/", (req, res) => {
  const { userId } = req.query;
  const notifications = readData().filter((n) => n.userId === userId);
  res.status(200).json(notifications);
});

module.exports = router;
