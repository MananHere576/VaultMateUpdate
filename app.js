import express from "express";
import bodyParser from "body-parser";
import os from 'os';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import User from "./models/user_model.js";
import Images from "./models/image_model.js";
import save_image_file_service from "./services/save_image_file_service.js";
import generate_token from "./utils/generate_token.js";
import verifyToken from "./middlewares/verifyToken.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);  // Ensure this outputs the correct connection string


dotenv.config();
const port =3000;
const app=express();

app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/",(req,res)=>{
    res.render("load.ejs");
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

app.get("/main",(req,res)=>{
    res.render("main.ejs");
});

app.get("/signin",(req,res)=>{
    res.render("start.ejs");
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});


app.post("/signup",(req,res)=>{
    console.log(req.body);
    const userr = new User({
        _id: req.body.phoneNumber,
        Email : req.body.email,
        Name : req.body.firstName+" "+req.body.lastName,
        Password : req.body.password
    });
    userr.save()
    .then(()=>{
        console.log("New user saved!");
        res.render("gotregistered.ejs");
    }).catch((err)=>{
        console.log(err);
        res.render("useralreadyexits.ejs");
    })
});

  

app.post("/signin",(req,res)=>{
    // console.log(req.body);
    User.findOne({_id:req.body.mobile})
    .then(detail=>{
        console.log(detail);
        if(detail==null){
            res.render("usernotfound.ejs");
        }else if(detail.Password==req.body.password){
            const token = generate_token({user:req.body.mobile},'30m');
            res.cookie('authToken', token, { httpOnly: true });
            res.redirect("/user");
        }
        else{
            res.render("wrongpassword.ejs");
        }
    })
    .catch(err=>{
        console.log(err);
        res.redirect("/main");
    })
});



// main page

app.get("/user",verifyToken,(req,res)=>{
    res.render("main.ejs");
});

// docs

app.get("/aadhar", (req, res) => {
    res.render("doc.ejs", {
        filename: 'Aadhar'
    });
});

app.get("/passport",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'Passport'
    });
});

app.get("/pancard",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'Pancard'
    });
});

app.get("/drivinglicence",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'DrivingLicence'
    });
});

app.get("/highschoolmarsheet",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'Highschool'
    });
});

app.get("/inter",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'Inter'
    });
});

app.get("/abc",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'ABCID'
    });
});

app.get("/others",(req,res)=>{
    res.render("doc.ejs", {
        filename: 'Others'
    });
});


app.get("/upload",(req,res)=>{
    res.render("upload.ejs");
});

app.get("/preview",(req,res)=>{
    res.render("preview.ejs");
});


app.post('/upload/:filemode',upload.single('image'),verifyToken,(req,res)=>{
    save_image_file_service(req.file,req.user.user,req.params.filemode)
    .then(()=>{
        res.redirect('/upload');
    })
    .catch(()=>{
    })
});


app.get('/image/:filemode',verifyToken,(req,res)=>{
    const user = req.user.user;
    const filename = req.params.filemode;
    // console.log(filename);
    User.findOne({_id:user})
    .then(response=>{
        if(response){
            console.log('image requested by'+ user);;
            const file = response[filename];
            Images.findOne({ _id: file})
            .then((data) => {
                if (!data) {
                    return res.status(404).json({ error: "Image not found, Please upload the image first..!" });
                } else {
                    const contentType = data.Image.startsWith("/9j/") ? 'image/jpeg' : 'image/png';
                    res.set('Content-Type', contentType);
                    res.send(Buffer.from(data.Image, 'base64'));
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            });
        }else{
            res.send('No user found')
        }
    })
    .catch((err)=>{
        res.send('Internal server error');
    })
});


let localAddress = 'localhost';

const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
            localAddress = iface.address;
        }
    });
});


app.listen(process.env.PORT || port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server is also accessible at http://${localAddress}:${port}`);
});

