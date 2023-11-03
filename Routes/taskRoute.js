import { Router } from 'express';
import { taskModel } from '../Models/taskModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Authenticating a user
const authenticateUser = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the user ID
        console.log('User ID from JWT Token:', decoded.userId);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


// Getting all tasks for the logged-in user
router.get('/tasks', authenticateUser, async (req, res) => {
    try {
        const userTasks = await taskModel.find({ userId: req.user.userId });
        res.status(200).json(userTasks);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Getting a task by ID, but ensure it belongs to the logged-in user
router.get('/task/:id', authenticateUser, async (req, res) => {
    try {
        const task = await taskModel.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!task) {
            console.log('Task not found in the database.');
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error while fetching task:', error);
        res.status(500).json(error);
    }
});

// Create a new task associated with the logged-in user
router.post('/create', authenticateUser, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
        return res.status(400).json({ error: "Both 'title' and 'description' are required." });
        }

        const newTask = new taskModel({
        title: title,
        description: description,
        userId: req.user.userId, // Associate the task with the logged-in user
        });

        const savedItem = await newTask.save();
        res.status(200).json("Task added successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update a task by ID, but ensure it belongs to the logged-in user
router.put('/task/:id', authenticateUser, async (req, res) => {
    try {
        const updatedTask = await taskModel.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, { new: true });
        if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete a task by ID, but ensure it belongs to the logged-in user
router.delete('/task/:id', authenticateUser, async (req, res) => {
    try {
        const deletedItem = await taskModel.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deletedItem) {
        return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json('Task deleted successfully');
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
