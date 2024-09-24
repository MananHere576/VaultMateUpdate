import mongoose from "./database.js"

const profileImgSchema = new mongoose.Schema({
    Image : {
        required : true,
        type : String
    },
    ImageName:{
        required :true,
        type:String
    }
});
const Images = new mongoose.model("images",profileImgSchema);    // images

export default Images;