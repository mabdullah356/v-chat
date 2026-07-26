import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Users } from "lucide-react";

const OnlineUsers = () => {
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("error", (e) => console.warn("Server:", e));

    socket.emit("join", user._id);

    socket.on("online-users", (users) => setUsers(users));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">Online</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          <span className="text-xs text-gray-500">
            {connected ? users.length : 0}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {users.length > 0 ? (
          <ul className="py-1 space-y-2">
            {users.map((u) => (
              <li
                key={u._id || u.socketId}
                className="flex items-center gap-3 px-3 py-2 bg-gray-200 rounded-2xl hover:shadow-2xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="relative shrink-0">
                  <img
                    src={u.avatar}
                    alt={u.fullName}
                    className="w-9 h-9 rounded-full object-cover bg-gray-100"
                  />
                  {u.username === user.username && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 rounded-full leading-none whitespace-nowrap">
                        ME
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {u.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No users online</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
