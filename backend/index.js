import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Route
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

// Middleware configuration
app.use(express.json());
app.use(cookieParser());

// Upload file using express-fileupload package
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
	await mongoose.connect(DB_URI);
	console.log("Connected to MongoDB successfully!");
} catch (error) {
	console.error("Error connecting to MongoDB:", error);
	process.exit(1);
}

// Defining Route
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// Cloudinary Configuration
cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
