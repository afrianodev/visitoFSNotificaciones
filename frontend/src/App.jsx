import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsPersonFill } from "react-icons/bs";

const socket = io("http://localhost:3001");

function App() {
  const [notifications, setNotifications] = useState([]);
  const userId = "Pepito Pérez"; // Just a random user for test

  useEffect(() => {
    fetch(`http://localhost:3001/notifications?userId=${userId}`)
      .then((res) => res.json())
      .then(setNotifications);

    socket.on("notification", (notification) => {
      if (notification.userId === userId) {
        setNotifications((prev) => [notification, ...prev]);
      }
    });

    return () => socket.off("notification");
  }, [userId]);

  const markAsRead = (id) => {
    fetch(`http://localhost:3001/notifications/${id}/read`, { method: "PATCH" })
      .then((res) => res.json())
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      });
  };

  return (
    <div className="flex flex-col items-center w-1/2 mx-auto">
      <div className="flex justify-between px-10 py-6 bg-black rounded-md shadow mt-2 w-full">
        <h1 className="text-white font-bold text-2xl">Centro de notificaciones</h1>
        <div className="flex items-center gap-2 text-white">
          <BsPersonFill />
          <p>{userId}</p>
        </div>

      </div>
      <ul className="w-full">
        {notifications.length === 0 ?
        <li className="p-4 rounded-md shadow my-2 bg-gray-100">No tienes notificaciones nuevas</li>
        :
        notifications.map((n) => (
          <li
          key={n.id}
          className={`p-4 rounded-md shadow my-2  ${
            n.read ? "bg-gray-100" : "bg-red-300 font-semibold"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{n.message}</span>
            {!n.read && (
              <button
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-600"
                onClick={() => markAsRead(n.id)}
              >
                Marcar como leído
              </button>
            )}
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
