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
    if (filePath) return null;
    const responce = await cloudinary.uploader
      .upload(filePath, {
        resource_type: 'auto',
      })
      console.log("File Uploaded",responce.url)
      return responce
  } catch (error) {
    fs.unlinkSync(filePath)
    return null;
  }
};

export {uploadCoudinary}

// (async function() {

//     // Configuration
//     cloudinary.config({
//         cloud_name: 'dnbko3hwm',
//         api_key: '552529166858427',
//         api_secret: '<your_api_secret>' // Click 'View Credentials' below to copy your API secret
//     });

//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();
