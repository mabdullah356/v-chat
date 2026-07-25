const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"]
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver is required"]
    },
    type: {
        type: String,
        enum: ["text", "image", "video", "audio"],
        default: "text"
    },
    message: {
        type: String,
        trim: true
    },
    fileUrl:{
        type:String,
    }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
