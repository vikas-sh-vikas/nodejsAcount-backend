import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View Credentials' below to copy your API secret
});

const uploadCoudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const responce = await cloudinary.uploader
      .upload(filePath, {
        resource_type: 'auto',
      })
      // console.log("File Uploaded",responce.url)
    fs.unlinkSync(filePath)
      return responce
  } catch (error) {
    fs.unlinkSync(filePath)
    console.log("Error",error)
    return null;
  }
};

export {uploadCoudinary}
