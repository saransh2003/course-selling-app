import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: String,
	email: String,
	courseId: String,
	paymentId: String,
	amount: Number,
	status: String,
});

export const Order = mongoose.model("Order", orderSchema);
