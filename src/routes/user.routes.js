import { Router } from "express";
import {
  registerUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").put(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .put(
    verifyJWT,
    upload.single({ name: updateUserAvatar, maxCount: 1 }),
    updateUserAvatar
  );
router
  .route("/update-cover-image")
  .put(
    verifyJWT,
    upload.single({ name: updateUserCoverImage, maxCount: 1 }),
    updateUserCoverImage
  );

export default router;
