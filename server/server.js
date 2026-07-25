require("dotenv").config()
const http = require("http");
const app  = require("./src/app");
const connectDb  = require("./src/db/db");
const SocketInit   = require("./socket");

const PORT = process.env.PORT || 4000

const httpServer = http.createServer(app);

SocketInit(httpServer);

httpServer.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDb();
})