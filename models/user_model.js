
import mongoose from "./database.js";

const usersSchema = new mongoose.Schema({
    _id: { type: Number, auto: true },
    Email : String,
    Name: String,
    Password:String,
    Aadhar : String,
    Passport : String,
    Pancard: String,
    DrivingLicence:String,
    Highschool:String,
    Inter: String,
    ABCID:String,
    Others:String
});
const User = mongoose.model("userDetails", usersSchema);    // user collection

export default User;