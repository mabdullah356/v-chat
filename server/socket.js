const { Server } = require("socket.io");
const User = require("./src/Models/user.model");

const UpdateUserOnline = async (socketId, userId) => {
    if (userId) {
        const user = await User.findByIdAndUpdate(userId, { socketId, isOnline: true }, { new: true });
        if (!user) return null;
        return user;
    } else {
        const user = await User.findOneAndUpdate({ socketId }, { socketId: "", isOnline: false }, { new: true });
        if (!user) return null;
        return user;
    }
};

const GetOnlineUsers = async () => {
    const users = await User.find({ isOnline: true }).select("fullName username avatar");
    return users;
};

const SocketInit = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", async (id) => {
            console.log(id)
            await UpdateUserOnline(socket.id, id);
            const onlineUsers = await GetOnlineUsers();
            // console.log(onlineUsers);
            io.emit("online-users", onlineUsers);
        });

        socket.on("disconnect", async () => {
            await UpdateUserOnline(socket.id);
            const onlineUsers = await GetOnlineUsers();
            io.emit("online-users", onlineUsers);
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = SocketInit;
