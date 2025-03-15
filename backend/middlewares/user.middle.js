import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;
	// console.log(authHeader);
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Access denied. No token provided." });
	}
	const token = authHeader.split(" ")[1];
	// console.log("Token:" + token);
	try {
		const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
		// console.log(decoded);

		req.userId = decoded.id;
		// const n = (req.userId = decoded.id);
		// console.log(n);

		next();
	} catch (error) {
		res.status(401).json({ errors: "Invalid token or expired token" });
		console.log(error, "Invalid token or expired token");
	}
}

export default userMiddleware;

// In your user.controller.js file
