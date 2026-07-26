import { useContext, useEffect, useState, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import { currUser } from "../Contexts/CurrUserContext";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <main className="flex w-full h-screen overflow-hidden bg-gray-50">
      <section className="flex-1 flex flex-col min-w-0">
        <UserChat />
      </section>
      <aside className="w-72 border-l border-gray-200 bg-white flex flex-col">
        <OnlineUsers />
      </aside>
    </main>
  );
};

export default Chat;

function UserChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { currentUser } = useContext(currUser);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      if (user?._id) socket.emit("join", user._id);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (currentUser?.username && msg.sender._id !== user._id) {
        setMessages((prev) => [msg, ...prev]);
      }
    };

    socket.on("receive-message", handleNewMessage);
    return () => {
      socket.off("receive-message", handleNewMessage);
    };
  }, [currentUser, user._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser?.username) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/chats/${currentUser.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.chats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, token]);

  const sendNewMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await axios.post(
        "/api/chats",
        { username: currentUser.username, message: message.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const chat = res.data.chat;
      const newMsg = {
        ...chat,
        sender: { _id: user._id, fullName: user.fullName, avatar: user.avatar },
        createdAt: chat.createdAt || new Date().toISOString(),
      };
      setMessages((prev) => [newMsg, ...prev]);
      setMessage("");
      socketRef.current?.emit("send-message", {
        receiverId: currentUser._id,
        receiverUsername: currentUser.username,
        chat: newMsg,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNewMessage();
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!currentUser?.username) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Welcome to V-Chat
        </h2>
        <p className="text-sm text-gray-500">
          Select a user from the sidebar to start chatting
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
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
            <p className="text-xs text-emerald-500">Online</p>
          </div>
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

      <section className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          [...messages].reverse().map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender._id === user._id
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                }`}
              >
                <p>{msg.message}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.sender._id === user._id
                      ? "text-indigo-200"
                      : "text-gray-400"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">
              No messages yet. Say hello!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
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
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
          />
          <button
            onClick={sendNewMessage}
            disabled={!message.trim() || sending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white rounded-full transition-colors disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </footer>
    </main>
  );
}
