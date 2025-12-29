import express from "express";
import { register, login, getUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:userid", getUser);

// router.post("/courses", createCourse);
// router.get("/courses/category/:category", getCourseByCategory);


export default router;
