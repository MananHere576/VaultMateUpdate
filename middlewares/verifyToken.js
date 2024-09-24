import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();

const secretkey = process.env.secretkey;

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Missing Token, Please send token' });
    }


    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;