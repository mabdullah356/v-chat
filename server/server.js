require("dotenv").config()
const app  = require("./src/app");
const connectDb  = require("./src/db/db");

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDb();
})