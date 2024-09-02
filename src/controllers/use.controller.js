import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiErrors.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User} from '../models/user.model.js';
import { uploadCoudinary } from "../utils/cloudinary.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUsr = asyncHandler(async (req, res) => {
        const { username, fullName, email, password } = req.body;

        if(
            [ username, fullName, email, password ].some((field) => field?.trim() === "")
        )
        {
            throw new ApiError(400,"All Feilds are required")
        }
        const existUser = await User.findOne({
            $or: [{username},{email}]
        })
        if(existUser){
            throw new ApiError(409,"User already exist")
        }        
        const avatarLocalPath = req.files?.avatar[0]?.path
        //const coverImageLocalPath = req.files?.coverImage[0]?.path
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }
        if(!avatarLocalPath){
            throw new ApiError(404, "Avatar File is Required")
        }
        
        const avatar = await uploadCoudinary(avatarLocalPath)
        const coverImage = await uploadCoudinary(coverImageLocalPath)
        
        if(!avatar){
            throw new ApiError(404, "Avatar File is Required")
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage !== null ? coverImage.url : "",
            email,
            password,
            username: username.toLowerCase(),
        }
        )
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser) {
            throw new ApiError(500, "Something went wrong register user")
        }
        return res.status(201).json(
            new ApiResponse(200, createdUser,"Register Successful")
        )
});
const loginUser = asyncHandler(async (req, res) =>{

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    // document.cookie = `accessToken=${accessToken}`;
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export { registerUsr, loginUser,logoutUser };
