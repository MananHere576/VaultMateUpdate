import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`mongodb+srv://user_ayaan_31:${process.env.DATABASEPASSWORD}@cluster0.dmifkqb.mongodb.net/`);
mongoose.connection.on('connected',() => {
    console.log('Connected to the database');
});


export default mongoose;