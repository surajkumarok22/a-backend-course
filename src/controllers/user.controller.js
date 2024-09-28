import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import{ User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utills.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
  // get user details from user
  // valiidation- not empty
  // check if user already exists
  // check for images, check for avatar
  // upload them to cloudinary
  // craete user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response 

  const {  fullName, email, username,password} = req.body
  console.log("email: ",email)
  console.log("fullName: ",fullName)

  // if(fullName === ""){
  //   throw new ApiError(400, "full name is required")
  // }

  if (
    [fullName,email,username,password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400, "all fileds are required")
  }

 const existedUser = await User.findOne({
    $or: [{ username },{ email }]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exist")
  }
console.log(req.files);
  

  const avatarLocalPath =  req.files?.avatar[0]?.path;
  // console.log("avatart",avatarLocalPath)

  const coverImageLocalPath =  req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  // console.log("avatar",avatar)


  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "something went wrong while creating new user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "user register successfully")
  )

})

export {registerUser}