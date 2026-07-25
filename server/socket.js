const { Server } = require("socket.io");
const User = require("./src/Models/user.model");



//set connected user isOnline=true and also set socket.id
const UpdateUserOnline = async (socketId,userId)=>{

    if(userId){
        const user  = await User.findByIdAndUpdate(userId,{socketId,isOnline:true});
        
        if(!user){
            return "User not found"
        }
    }
    else{
        const user  = await User.findOneAndUpdate({socketId},{socketId:"",isOnline:false});
        
        if(!user){
            return "User not found"
        }
    }
}


const SocketInit = (httpServer) => {
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("send-userId",(id)=>{
            console.log(id);
            UpdateUserOnline(socket.id,id);
        })

        socket.on("disconnect", () => {
            UpdateUserOnline(socket.id);
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = SocketInit;
