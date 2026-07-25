const mongoose  = require("mongoose");


const userSchema = new mongoose.Schema({

    fullName:{
        type: String,
        required:[true,"Full name is required"],
        trim:true
    },
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username must be unique"],
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true , "Email must be unique"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    avatar:{
        type:String,
        default:"https://images.unsplash.com/photo-1781204515883-9f6863f32c58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    isTyping:{
        type:Boolean,
        default:false
    },
    socketId:{
        type:String
    }

},{timestamps:true});

const User = mongoose.model("User",userSchema);

module.exports = User;