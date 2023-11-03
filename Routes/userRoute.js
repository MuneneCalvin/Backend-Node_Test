import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../Models/userModel.js";

dotenv.config();
const router = Router();

// Registering a user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Logging a user and generating a JWT token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Check if the user exists
        const user = await userModel.findOne({ email });
    
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
    
        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
    
        // Create a JWT token
        const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET);
    
        res.status(200).json({ user, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
});

// Getting all users
router.get("/users", async (req, res) => {
    try {
        const allUsers = await userModel.find({});
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Getting a user
router.get("/userme/:id", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})


export default router;