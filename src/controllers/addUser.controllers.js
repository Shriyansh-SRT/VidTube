import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { app } from "../app";

const users = [];

const addUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;
  const newUser = { name: name, email: email, age: age };
  users.push(newUser);
  return res
    .status(200)
    .json(new ApiResponse(200, users, "User added successfully"));
});

export { addUser };
