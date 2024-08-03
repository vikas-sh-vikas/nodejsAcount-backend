import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from './app.js'

dotenv.config({
  path: "./env",
});
const port = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error".error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`Listening at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Db failed to connect ", err);
  });

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
