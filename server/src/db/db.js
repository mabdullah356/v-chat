require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async ()=>{
    
    const DatabaseURL =process.env.DB_URL;
    if(!DatabaseURL){
        throw new Error("DataBase Url is required")
    };

    try {
        await mongoose.connect(DatabaseURL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDb;