import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // todo // accept the data from the user
  const { fullName, username, email, password } = req.body;

  // validate input/ request body
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // check if the user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "This user already exists");
  }

  // now since the user is not existed, we can proceed to create the user
  // now we need to upload the files to cloudinary

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const converImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  if (!converImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  // if we have the files, we can upload them to cloudinary
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(converImageLocalPath);

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "Error uploading avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(converImageLocalPath);
    console.log("Uploaded cover image", coverImage);
  } catch (error) {
    console.log("Error uploading cover image", error);
    throw new ApiError(500, "Error uploading cover image");
  }

  // now we can create the user
  try {
    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "User is not created successfully");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User is created successfully"));
  } catch (error) {
    console.log("Failed creating a User");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(500, "Failed deleting files from cloudinary");
  }
});

export { registerUser };
