const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const session = require('express-session');
const multer = require("multer");
const sharp = require('sharp');
const fs = require("fs");
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

dotenv.config();

const app = express();

const port = process.env.port || 3000;
const db = require("./db");

// Admin UserName and Password

const adminnum = process.env.an1;
const adminpassword = process.env.ap1; 
const adminnum2 = process.env.an2;
const adminpassword2 = process.env.ap2;


const {User , ImageModel, Admin} = require("./models");


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));

const Storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'tempFileDir');
    },
    filename: (req, file, cb) => {
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const store = multer({
    storage: Storage
});






app.post("/signup", async (req,res)=> {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const registered = false;
    const status = "Not Registered";
    // console.log(req.body);
    // console.log(email);
    // console.log(phone);
    // console.log(password);

    try{
        //checks if the user with the same phone number already exists
        const existinguser = await User.findOne({phone});
        if(existinguser){
            return res.status(409).json({message : "Phone Number is already registered"});
               
        } 
        const newUser = new User({ email,phone,  password, registered,status });
        await newUser.save();
        res.render("index.ejs");
        // res.status(201).json({ user: newUser});
    }
    catch(err){
        console.error("mongodb connection error",err);
        res.status(500).json({message : "Error registering user"});
    }
    // res.render("index.ejs",{
    //     email : email,
    //     phone : phone,
    //     password : password,
    // });
});

app.post("/login", async (req, res)=> {
    const {phone , password} = req.body;
    // req.session.p = phone;
    // req.session.save();
    res.cookie('phone',phone, {maxAge: 3600000});
    res.cookie('password',password, {maxAge: 3600000});

    
    
    const admin = false;
    if((phone===adminnum && password=== adminpassword) || (phone===adminnum2 && password=== adminpassword2)){
        console.log("admin creentials");
        const admin = true;
        res.redirect("/admin");
    }
    else {
        console.log(phone);
        const user = await User.findOne({phone:phone});
        var agecheck = false;
        if(user){
            var status = user.status;
        }
        else{
            res.redirect("/");
        }
        console.log(status)

        try{
            const userlogin = await User.findOne({phone});
            if(userlogin){
            const registered = userlogin.registered;
            
            if(password == userlogin.password){
                
                if(registered == true){
                    const {fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum} = userlogin;
                    const all_images = await ImageModel.find({phone:phone});
                    res.render("register.ejs", {phone,status,admin,registered,fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum,all_images});
                }
                else{
                res.render("register.ejs", {phone,agecheck,admin,registered});
            }
            }
            else{
                console.log("Wrong Password");
            }
            }
            else{
                console.log("User not registered");
            }
            
        }catch(err){
            console.error("error logging in",err);
        }
    }
});

app.post("/register",store.array('img',4), async (req , res)=>{
    const admin = req.query.admin;
    // Getting Current date and time 
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const dat = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const seconds = date.getSeconds();
    const datetime = `${month}/${dat}/${year}  ${hour}:${min}:${seconds}`;
    console.log(datetime);

    const userphone = req.cookies.phone;
    const userpassword = req.cookies.password;
    const checkpassword = await User.findOne({phone:userphone});
    if(userpassword === checkpassword.password){
        console.log("checked password sucessfully");
        var phone = userphone;
    }
    console.log("phone jdkjd:",phone);
    
    const registereduser = await User.findOne({phone:phone});
    
    const reg = registereduser.registered;
    
    if(reg){
        console.log("getting in if");
        const registered = reg;
        console.log("getting into if loop");
        const status = registereduser.status;
        const {fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum} = registereduser;
        const all_images = await ImageModel.find({phone:phone});
        res.render("register.ejs",{phone,admin,status,registered,fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum,all_images});      
    }
    else{
        
        const birthdate = new Date(req.body.dob );
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();
        
        // Check if the user is 18 years or older
        
        if (age < 18) {
            return res.status(400).send('You must be 18 years or older to proceed.');
        }
        
        
        await User.updateOne({phone},{$set: {registered:true,status:"Pending",registeredtime:datetime}});
        const userlogin = await User.findOne({phone});
        console.log("checking");
        const registered = userlogin.registered; 
        const status = userlogin.status;

    
    //Image Upload

    // console.log(userlogin);
    
    const {fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum} = req.body;
    
    try{
        const files = req.files;

    try {
        const imgArray = await Promise.all(files.map(async (file) => {
            const buffer = await sharp(file.path)
                .resize({ width: 600, height: 300 ,fit:'inside'}) // Adjust the dimensions as needed
                .toBuffer();
            
            const imageBase64 = buffer.toString('base64');
            
            return {
                phone: phone,
                filename: file.originalname,
                contentType: file.mimetype,
                imageBase64,
            };
        }));

        const result = await Promise.all(imgArray.map(async (imageData) => {
            const newUpload = new ImageModel(imageData);

            try {
                await newUpload.save();
                return { msg: "Images Uploaded Successfully" };
            } catch (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    return Promise.reject({ error: `Duplicate files` });
                }
                return Promise.reject({ error: error.message || "Cannot Upload" });
            }
        }));

        
    } catch (err) {
        console.error(err);
    }
       
        await User.updateMany({phone},
            {accnum:accnum,
                fullname:fullname,
                dob:dob,
                address:address,
                pincode:pincode,
                bankname:bankname,
                branchname:branchname,
                ifsc:ifsc,
                dl:dl,
                bikenum:bikenum,
                pannum:pannum,
                },
            );
        const upuserlogin = await User.findOne({phone:phone});
        // console.log(upuserlogin);
        const all_images = await ImageModel.find({phone:phone});
        
        res.render("register.ejs",{registered,status,admin,fullname, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum,all_images});
    }
    catch(err){
        console.error("getting error", err);
    }
}
});

app.get("/admin", async (req,res)=>{
    const phone = req.cookies.phone;
    const password = req.cookies.password;
    if((phone===adminnum && password=== adminpassword) || (phone===adminnum2 && password=== adminpassword2)){
        const status = req.query.status;
        // console.log(status);
        let userdata;
        if(status){
            try {
                userdata = await User.find({ status: status });
            } catch (error) {
                console.error(error);
            }
        }
        else{
        userdata = await User.find();
        // console.log(userdata);
        }
        res.render("admin.ejs", {userdata});
   }
   
});

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});

app.get("/logout",(req,res)=>{
   
    res.clearCookie('phone');
    res.clearCookie('password');
    res.redirect("/");
});


app.get("/", (req,res)=>{
    res.render("index.ejs");
});

// testing
app.get("/test", async (req,res)=>{
    res.render("test.ejs");
});
app.post("/upload", (req,res)=>{
    res.send(req.body);
});
//testing end


app.get("/register", async (req,res)=>{
    const adminphone = req.cookies.phone;
    const admin = req.query.admin;
    const updatestatus = req.query.status;
    const userphone = req.query.userphone;
    if(updatestatus){
        await User.updateOne({phone:userphone},{$set: {status:updatestatus}});
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const dat = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const seconds = date.getSeconds();
        const datetime = `${month}/${dat}/${year}  ${hour}:${min}:${seconds}`;
        console.log(datetime);
        Admin.findOne({adminphone:adminphone})
            .then((savedadmin)=>{
                if(savedadmin){
                    savedadmin.approval.push({phone:userphone,approvaltime:datetime,status:updatestatus});
                    return savedadmin.save();
                }
                throw new Error('Admin not found');
            })


    }
    console.log(admin);
    if(admin === "true"){
            
        console.log("yes getting in ");
        const admin = req.query.admin;
        console.log(userphone);
        const registereduser = await User.findOne({phone: userphone});
        console.log(registereduser);
        const {fullname,registered,status, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum} = registereduser;
        console.log(registered);
        console.log(status);
        console.log(fullname,registered,status, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum);
        const all_images = await ImageModel.find({phone:userphone});
        res.render("register.ejs",{userphone,admin,all_images,fullname,registered,status, dob, address, pincode,accnum,bankname,branchname,ifsc,dl,bikenum,pannum});
    }

});

app.listen(port,()=>{
    try{
        console.log("Connection made at port 3000");
    }catch(err){
        console.error("error while establising connection",err);
    }
});