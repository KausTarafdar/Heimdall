import mongoose from "mongoose";
import { config } from "../config";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, { minPoolSize: 10 });
        console.log("Connected to MongoDB");
    } catch(e: unknown){
        if (typeof e === "string") {
            console.log(e.toUpperCase())
        } else if (e instanceof Error) {
            console.log(e.message)
        }
    }
}

export default connectToMongoDB;
