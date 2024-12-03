const queue = [];
let io;

const initQueue = (socketIo) => {
  io = socketIo;
  processQueue();
};

const addToQueue = (notification) => {
  queue.push(notification);
};

const processQueue = () => {
  setInterval(() => {
    if (queue.length > 0) {
      const notification = queue.shift();
      io.emit("notification", notification);
    }
  }, 1000);
};

module.exports = { initQueue, addToQueue };
