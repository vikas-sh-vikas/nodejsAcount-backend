import mongoose from "mongoose";
import { DB_NAME } from '../constant.js'



const connectDb = async () => {
    try {
        const connectionInstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongoDbConnect !! DB Host ${connectionInstant.connection.host}`)
    } catch (error) {
        console.log("Error",error)
        // throw error;
        process.exit(1)
    }   
}

export default connectDb