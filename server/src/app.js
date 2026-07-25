const express  = require("express")
const cookieParser = require("cookie-parser");

//app using express
const app = express()

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes
const userRouter = require("./Routes/user.routes");
app.use("/api/users",userRouter);



module.exports = app