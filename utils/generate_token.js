import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.secretKey;

const generate_token = (Data,duration)=>{
    const token = Jwt.sign(Data,secretKey,{expiresIn: duration});
    return token;
};

export default generate_token;