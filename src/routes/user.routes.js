import { Router } from "express";
import { registerUsr } from "../controllers/use.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields(
        {
            name: "avatar",
            maxCout: 1
        },
        {
            name: "coverImage",
            maxCout: 1
        }
    ),
    registerUsr
)



export default router