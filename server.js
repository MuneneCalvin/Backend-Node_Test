import dotenv from "dotenv";
import express from "express";
import connectDb from './Db/dbConnection.js';
import taskRouter from "./Routes/taskRoute.js";
import userRouter from "./Routes/userRoute.js";

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/api", taskRouter);


// Database connection
connectDb();

// Server connection
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
