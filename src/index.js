import connectDb from "./db/index.js";
// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'

dotenv.config({
    path:'./env'
})

connectDb()


// import express from "express";
// const app = express();
// ( async () => {
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("error".error)
//             throw error
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log(error);
//         throw err
//     }
// })()