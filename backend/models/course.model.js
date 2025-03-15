import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	image: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	creatorId: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
});

export const Course = mongoose.model("Course", courseSchema);
