import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadCoudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/ApiResponse.js";

const registerUsr = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Feilds are required");
  }
  const existUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new ApiError(409, "User already exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar File is Required");
  }
  const avatar = await uploadCoudinary(avatarLocalPath);
  const coverImage = await uploadCoudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(404, "Avatar File is Required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register user");
  }
  return res
    .status(201)
    .json(new APIResponse(200, createdUser, "User Register Successfully"));
});

export { registerUsr };
