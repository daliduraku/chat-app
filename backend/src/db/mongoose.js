import mongoose from "mongoose";
import dotnev from "dotenv";

dotnev.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB Connected');
        process.exit();
    })
    .catch(err => {
        console.log(err)
    })