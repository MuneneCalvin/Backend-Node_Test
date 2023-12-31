import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const taskModel = mongoose.model("Tasks", taskSchema);
