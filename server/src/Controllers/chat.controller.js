const User = require("../Models/user.model");
const Chat  = require("../Models/chat.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const newChat = async (req,res) => {
    
    const {username,type,message} = req.body;
    
    if(!username){
        return res.status(400).json({message:"Receiver is required"});
    };
    console.log(req.file);    
    try {
        
        const receiverUser = await User.findOne({username});
        
        if(!receiverUser){
            return res.status(404).json({message:"Receiver User not found"});
        };

        let imageUrl = null;
        if(req.file){
            const result = await new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder:"chats"},
                    (err,result)=> err ? reject(err) : resolve(result)
                );
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }
        
        const newChat  = new Chat({sender:req.user.id,receiver:receiverUser._id,message,fileUrl:imageUrl});

        await newChat.save();

        return res.status(201).json({message:"New chat created successfully",chat:newChat})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"})
    }


};

//get all chats with respect to receiver 
const ChatWithUser = async (req, res) => {
    const {username } = req.params;

    if (!username) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const chats = await Chat.find({
            $or: [
                { sender: req.user._id, receiver: user._id },
                { sender: user._id, receiver: req.user._id }
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