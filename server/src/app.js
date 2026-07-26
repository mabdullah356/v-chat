const express  = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors");

//app using express
const app = express()

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.url);
    next();
});

//Routes
const userRoutes = require("./Routes/user.routes");
const chatRoutes = require("./Routes/chat.routes");

app.use("/api/users",userRoutes);
app.use("/api/chats",chatRoutes);



module.exports = app