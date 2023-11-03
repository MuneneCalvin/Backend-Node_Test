import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`Database connected successfully`);
    } catch (error) {
        console.log(error);
    }
}

export default dbConnection;