const mongoose = require("mongoose");

const signupscema = new mongoose.Schema({
    email : {type: String, required:true},
    phone: {type: Number,required:true},
    password: {type :String, required: true},
    registered: Boolean,
    registeredtime: String,
    status:String,
    fullname: String,
    dob: Date,
    address: String,
    pincode: Number,
    accnum: Number,
    // passbookfile: File,
    bankname: String,
    branchname: String,
    ifsc: String,
    dl: String,
    bikenum:String,
    // rcfile: File,
    pannum:String,
    // panfile:File,


});

const imagescema = new mongoose.Schema({
    phone:{
        type:Number,
        required: true,
    },
    filename:
    {
        type: String,
        required: true,
    },
    contentType:{
        type: String,
        required: true,
    },
    imageBase64:
    {
        type: String,
        required: true,
    }
});

const userstatus = new mongoose.Schema({
    phone : Number,
    status: String,
    approvaltime : String,
});

const adminscema = new mongoose.Schema({
    adminphone:{
        type:Number,
        required: true,
    },
    approval:[userstatus ],

});

const User = mongoose.model("User", signupscema);

const ImageModel = mongoose.model("Image", imagescema);

const Admin = mongoose.model("Admin",adminscema);

module.exports = {User, ImageModel, Admin};