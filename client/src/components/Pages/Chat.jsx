import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../OnlineUsers";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import { currUser } from "../Contexts/CurrUserContext";

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <main className="flex w-full h-screen overflow-hidden bg-gray-50">
      <section className="w-[70%] flex-1 flex flex-col min-w-0">
        <UserChat />
      </section>
      <aside className="w-[30%] border-l border-gray-200 bg-white flex flex-col">
        <OnlineUsers />
      </aside>
    </main>
  );
};

export default Chat;

function UserChat() {
  const [message, setMessage] = useState("");
  const {currentUser} = useContext(currUser);

  const messages = [
    { id: 1, sender: "other", text: "Hey, how are you?", time: "10:30 AM" },
    { id: 2, sender: "me", text: "I'm good, thanks! You?", time: "10:32 AM" },
    { id: 3, sender: "other", text: "Doing great, just working on the project.", time: "10:33 AM" },
    { id: 4, sender: "me", text: "Nice! Need any help?", time: "10:35 AM" },
  ];

  return (
    <main className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {currentUser?.avatar ? (
            <>
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-10 h-10 rounded-full object-cover bg-gray-100"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  {currentUser.fullName}
                </h1>
                <p className="text-xs text-gray-500">@{currentUser.username}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  Select a chat
                </h1>
                <p className="text-xs text-gray-500">
                  Click an online user to start
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "me"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.sender === "me" ? "text-indigo-200" : "text-gray-400"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </section>

      <footer className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
          />
          <button className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-full transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}
