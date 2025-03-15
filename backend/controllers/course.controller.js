import { v2 as cloudinary } from "cloudinary";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
	const adminId = req.adminId;

	// req -> For Input
	// res -> For Output

	// const title = req.body.title;
	// const description = req.body.description;
	// const price = req.body.price;
	// const image = req.body.image;
	const { title, description, price } = req.body;

	try {
		if (!title || !description || !price) {
			return res.status(400).json({ errors: "All fields are required." });
		}

		const { image } = req.files;
		if (!image || Object.keys(req.files).length === 0) {
			return res.status(400).json({ errors: "Please upload an image." });
		}

		const allowedFormat = ["image/png", "image/jpeg"];
		if (!allowedFormat.includes(image.mimetype)) {
			return res.status(400).json({ errors: "Invalide file format. Please upload a PNG or JPG image." });
		}

		// Cloudinary Code
		const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
		if (!cloud_response || cloud_response.error) {
			return res.status(400).json({ errors: "Error uploading image to Cloudinary" });
		}

		const courseData = {
			title,
			description,
			price,
			image: {
				public_id: cloud_response.public_id,
				url: cloud_response.url,
			},
			creatorId: adminId,
		};
		const course = await Course.create(courseData);
		res.status(201).json({
			message: "Course created successfully",
			course,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ errors: "Error Creating Course" });
	}
};

export const updateCourse = async (req, res) => {
	const adminId = req.adminId;
	const { courseId } = req.params;
	const { title, description, price, image } = req.body;
	const courseSearch = await Course.findById(courseId);
	if (!courseSearch) {
		return res.status(404).json({ errors: "Course not found" });
	}
	try {
		const course = await Course.findOneAndUpdate(
			{
				_id: courseId,
				creatorId: adminId,
			},
			{
				title,
				description,
				price,
				image: {
					public_id: image?.public_id,
					url: image?.url,
				},
			}
		);
		if (!course) {
			return res.status(404).json({ message: "Can't Update, Created by other Admin" });
		}
		res.status(201).json({ message: "Course updated Successfully", course });
	} catch (error) {
		res.status(500).json({ errors: "Error in course updating" });
		console.log("Error in course updating", error);
	}
};

export const deleteCourse = async (req, res) => {
	const adminId = req.adminId;
	const { courseId } = req.params;
	const courseSearch = await Course.findById(courseId);
	if (!courseSearch) {
		return res.status(404).json({ errors: "Course not found" });
	}
	try {
		const course = await Course.findOneAndDelete({
			_id: courseId,
			creatorId: adminId,
		});
		if (!course) {
			return res.status(404).json({ message: "Can't Delete, Created by other Admin" });
		}
		res.status(200).json({ message: "Course deleted successfully" });
	} catch (error) {
		res.status(500).json({ errors: "Error in Course Deletion" });
		console.log("Error in Course Deletion", error);
	}
};

export const getCourses = async (req, res) => {
	try {
		const courses = await Course.find({});
		res.status(200).json({ courses });
	} catch (error) {
		res.status(500).json({ errors: "Error to get Courses" });
		console.log("Error to get Courses", error);
	}
};

export const courseDetails = async (req, res) => {
	const { courseId } = req.params;
	try {
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}
		res.status(200).json({ course });
	} catch (error) {
		res.status(500).json({ errors: "Error in geting course detail" });
		console.log("Error in geting course detail", error);
	}
};

// Purchase Functions
import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
	// console.log("Purchase");
	const { userId } = req;
	const { courseId } = req.params;
	try {
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ errors: "Course not found" });
		}
		const existingPurchase = await Purchase.findOne({ userId, courseId });
		if (existingPurchase) {
			return res.status(400).json({ errors: "You have already purchased this course" });
		}

		// Stripe payment gateway code goes here ...
		const amount = course.price;
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "usd",
			payment_method_types: ["card"],
		});

		res.status(201).json({
			message: "Course purchased successfully",
			course,
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		res.status(500).json({ errors: "Error in buying courses" });
		console.log(error, "Error in buying courses");
	}
};
