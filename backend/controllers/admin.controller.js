import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import config from "../config.js";

export const signup = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const adminSchema = z.object({
		firstName: z.string().min(2, { message: "First name mininum 2 characters" }),
		lastName: z.string().min(2, { message: "Last name mininum 2 characters" }),
		email: z.string().email(),
		password: z.string().min(6, { message: "Password must be at least 6 characters" }),
	});

	const validatedData = adminSchema.safeParse(req.body);
	if (!validatedData.success) {
		return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const existingAdmin = await Admin.findOne({ email: email });

	try {
		if (existingAdmin) {
			return res.status(400).json({ errors: "Admin already exists" });
		}
		const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });
		const admin = newAdmin.save();
		res.status(201).json({ message: "Signup Succedded", newAdmin });
	} catch (error) {
		res.status(500).json({ errors: "Error in signup" });
		console.log("Error in signup", error);
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const admin = await Admin.findOne({ email: email });
		if (!admin) {
			return res.status(403).json({ errors: `Invalid email or password ${admin}` });
		}
		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			return res.status(403).json({ errors: "Invalid email or password" });
		}
		// jwt validation
		const token = jwt.sign(
			{
				id: admin._id,
			},
			config.JWT_ADMIN_PASSWORD,
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

		res.status(201).json({ message: "Login Succeeded", admin, token });
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
