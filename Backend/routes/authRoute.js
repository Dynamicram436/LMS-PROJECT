import express from "express";
import { register, login, getUser, uploadProfilePic, getProfilePic, uploadProfilePicture } from "../controllers/authControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:userid", getUser);

// Profile picture routes
router.post("/upload-profile-pic", protect, uploadProfilePicture, uploadProfilePic);
router.get("/profile-pic/:userid", getProfilePic);

// router.post("/courses", createCourse);
// router.get("/courses/category/:category", getCourseByCategory);


export default router;
