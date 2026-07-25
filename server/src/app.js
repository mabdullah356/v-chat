const express  = require("express")
const cookieParser = require("cookie-parser");

//app using express
const app = express()

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes
const userRoutes = require("./Routes/user.routes");
const chatRoutes = require("./Routes/chat.routes");

app.use("/api/users",userRoutes);
app.use("/api/chats",chatRoutes);



module.exports = app