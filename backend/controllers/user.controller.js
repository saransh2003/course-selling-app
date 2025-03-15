import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const userSchema = z.object({
		firstName: z.string().min(2, { message: "First name mininum 2 characters" }),
		lastName: z.string().min(2, { message: "Last name mininum 2 characters" }),
		email: z.string().email(),
		password: z.string().min(6, { message: "Password must be at least 6 characters" }),
	});

	const validatedData = userSchema.safeParse(req.body);
	if (!validatedData.success) {
		return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await User.findOne({ email: email });

	try {
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const newUser = new User({ firstName, lastName, email, password: hashedPassword });
		const user = newUser.save();
		res.status(201).json({ message: "Signup Succedded", newUser });
	} catch (error) {
		res.status(500).json({ errors: "Error in signup" });
		console.log("Error in signup", error);
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(403).json({ errors: `Invalid email or password ${user}` });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(403).json({ errors: "Invalid email or password" });
		}
		// jwt validation
		const token = jwt.sign(
			{
				id: user._id,
			},
			config.JWT_USER_PASSWORD,
			{ expiresIn: "1d" }
		);
		// set jwt cookie for 1 day
		const cookieOptions = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true, // Can't be accessed via js directly
			secure: process.env.NODE_ENV === "production", // set to true in production environment only
			// secure is set to false, environment: is set to "development"
			// use https in production environment when set to true
			sameSite: "strict", // Prevent from CSRF Attacks
		};
		res.cookie("jwt", token, cookieOptions);

		res.status(201).json({ message: "Login Succeeded", user, token });
	} catch (error) {
		res.status(500).json({ errors: "Error in login" });
		console.log("Error in login", error);
	}
};

export const logout = (req, res) => {
	try {
		if (!req.cookies || !req.cookies.jwt) {
			return res.status(401).json({ errors: "Kindly login first" });
		}
		res.clearCookie("jwt");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ errors: "Error! Couldn't log out" });
		console.error(error, "Error logging out");
	}
};

export const purchases = async (req, res) => {
	const userId = req.userId;
	try {
		const purchased = await Purchase.find({ userId: userId });
		let purchasedCourseId = [];
		for (let i = 0; i < purchased.length; i++) {
			purchasedCourseId.push(purchased[i].courseId);
		}
		const courseData = await Course.find({ _id: { $in: purchasedCourseId } });
		res.status(200).json({ purchased, courseData });
	} catch (error) {
		res.status(500).json({ errors: "Error in fetching purchases" });
		console.log("Error in fetching purchases", error);
	}
};
