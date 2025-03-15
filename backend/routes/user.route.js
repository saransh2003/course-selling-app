import express from "express";
import { login, signup, logout, purchases } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middle.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/purchases", userMiddleware, purchases);

export default router;
