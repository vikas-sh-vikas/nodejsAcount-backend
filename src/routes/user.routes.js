import { Router } from "express";
import { registerUsr,loginUser,logoutUser } from "../controllers/use.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js'



const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCout: 1
        },
        {
            name: "coverImage",
            maxCout: 1
        }]
    ),
    registerUsr 
)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)



export default router