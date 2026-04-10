const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const User = mongoose.model('User');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const client = new OAuth2Client('11697718537-dqjd46buavim9ufcdipmvpfe3ksvt5lk.apps.googleusercontent.com');

const createAdmin = async (req, res) => {
    try {
        const { name, regno, email } = req.body;
        let admin = new Admin();
        admin.name = name;
        admin.regno = regno;
        admin.email = email;
        // debugger; // execution pauses here
        await admin.save();
        res.status(200).send({ data: admin, msg: "Admin created" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ data: err, msg: "Admin created failed" });
    }

}

const getAdmin = async (req, res) => {
    try {
        let admin = await Admin.updateOne({}, { $set: { name: "Aditya" } });
        res.status(200).send({ data: admin, msg: "Get Admin" });
    } catch (err) {
        res.status(400).send("Get Admin not work")
    }

}

const uploadPics = async (req, res) => {
    try {
        res.json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(404).send(error + ' Image not found');
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        // compare password
        let data = await Admin.findOne({name}, {password: 1});
        if(!data) {
            return res.status(400).json({ message: "Invalid name" });
        }
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: "11111", name: "Abhishek", section: "A", branch: "CSE-DS", semester: "6" },
            "secretKey", // use env variable in production
            { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Login error" });
    }
}

const signupUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(req.query.age, " age");
        const hashedPassword = await bcrypt.hash(password, 10);
        let admin = new Admin({name, password: hashedPassword });
        await admin.save();
        res.status(201).json({ data: admin, message: "User registered successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in signup" });
        // $2b$10$daUwhwxhu6R1TBrCvaAOzeODNCqaiEyF855dDik4qBfRlizuT.cPa
    }
}


const getUser = async (req, res) => {
    res.status(200).send({
        message: "Protected data",
        user: req.user
    });
}

const sendMail = async (req, res) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "singhalmca04@gmail.com",
                pass: 'sdwp yrce hiya yojm' 
            }
        });
        const info = await transport.sendMail({
            from: "Test Mail from Vinay singhalmca04@gail.com",
            to: 'vinayk@srmist.edu.in',
            subject: 'Subject -- DSA Project Presentation',
            text: "First Batch presetation on 9th April"
        });
        res.status(200).send({data: info, msg: "Email send"});
    } catch(err) {
        console.log("Error " + err);
        res.status(500).send({msg: "Internal server error"});
    }
}

const changePassword = async (req, res) => {
    try{
        const { name, newpassword } = req.body;
        const newHashedPassword =  await bcrypt.hash(newpassword, 10);
        let data = await Admin.findOneAndUpdate({ name }, {$set: {password: newHashedPassword}}, {returnDocument: 'after'});
        res.status(200).send({  message: "Password changed", data });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Error in signup" });
    }
    
}

const downloadFile = async (req, res) => {
    var filePath = "/uploads/name";
    fs.readFile(__dirname + filePath, function (err, data) {
        res.send(data);
    });
}

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        console.log(token, 'token');
        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;

        // Check if user exists
        let user = await Admin.findOne({ email });

        if (!user) {
            user = new Admin({
                name,
                email,
                googleId: sub,
                image: picture
            });

            await user.save();
        }

        // Generate JWT iejb ibvn ehid qhiu
        const appToken = jwt.sign(
            { id: user._id },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token: appToken,
            user
        });

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Google login failed" });
    }
};

module.exports = {
    createAdmin,
    getAdmin,
    uploadPics,
    loginUser,
    signupUser,
    getUser,
    downloadFile,
    googleLogin,
    changePassword,
    sendMail
}