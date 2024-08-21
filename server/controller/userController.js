const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt")
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.register = async (req, res) => {
    try {
        const { email, password, fullname, role } = req.body;

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(409).json({ msg: "Email already taken, try with another one", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            fullname,
            role
        });

        const userResponse = {
            _id: user._id,
            role: user.role,
        };

        return res.status(201).json({ user: userResponse, status: true });

    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ msg: "Internal Server Error", status: false });
    }
};

module.exports.login = (async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email })

        if (user.role !== role) {
            return res.status(400).json({ msg: "role is not matched", status: false });
        }

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required", status: false });
        }

        if (!user) {
            return res.json({ msg: "invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({ msg: "incorrect username or password", status: false });
        }

        if (role !== user.role) {
            return res.json({ msg: "role does not match with the email", status: false });
        }

        const userObject = user.toObject();
        delete userObject.password;

        const token = createToken(userObject)

        return res.json({ token, user: user._id, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "internal server error", status: false })
    }
})

module.exports.forgotPassword = async (req, res) => {
    try {

        console.log(req.body)

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "Email is not registered" });
        }

        const otp = Math.floor(Math.random() * 900000) + 100000;

        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {

            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
                return res.status(500).json({ msg: "Failed to send email", error });
            }
            console.log('Email sent:', info.response);
            return res.status(200).json({ msg: "Password reset OTP sent successfully" });
        });

    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ msg: "Internal server error", err });
    }
};

module.exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "Email is not registered" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        return res.status(200).json({ msg: "OTP verified successfully" });

    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ msg: "Internal server error", err });
    }
};

module.exports.changePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found", status: false });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Password updated successfully", status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", status: false });
    }
};
