import dotenv from "dotenv";

dotenv.config();

// Get JWT_USER_PASSWORD from environment variables
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY = "sk_test_51R2rTCENW4dxQH6ITzbAaHkOdRKUuLc9hT7UTNsZBq7ycZjj1qDSBIgsVNjKcx9P8qkpbCjJeLMZOjkAOB2iVX0B00jlS861bX";

export default {
	JWT_USER_PASSWORD,
	JWT_ADMIN_PASSWORD,
	STRIPE_SECRET_KEY,
};
