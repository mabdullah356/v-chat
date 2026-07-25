const User = require("../Models/user.model");
const Chat  = require("../Models/chat.model");

const newChat = async (req,res) => {
    
    const {receiver,type,message} = req.body;
    
    if(!receiver){
        return res.status(400).json({message:"Receiver is required"});
    };
    
    try {
    
        const receiverUser = await User.findById(receiver);
        
        if(!receiverUser){
            return res.status(404).json({message:"Receiver User not found"});
        };
        
        const newChat  = new Chat({sender:req.user.id,receiver,message});

        await newChat.save();

        return res.status(201).json({message:"New chat created successfully",chat:newChat})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"})
    }


};

//get all chats with respect to receiver 
const ChatWithUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const chats = await Chat.find({
            $or: [
                { sender: req.user._id, receiver: id },
                { sender: id, receiver: req.user._id }
            ]
        })
            .populate("sender", "fullName avatar")
            .populate("receiver", "fullName avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Chats retrieved successfully", chats });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {newChat , ChatWithUser}