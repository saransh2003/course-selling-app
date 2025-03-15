import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// User and Token Section
	const admin = JSON.parse(localStorage.getItem("admin"));
	const token = admin?.token; // using optional chaining to avoid app crashing
	// console.log("User (Purchase): ", user);
	// console.log("Token (Purchase): ", token);

	// Fetch Course data
	useEffect(() => {
		if (!token) {
			toast.error("Please login to admin");
			navigate("/admin/login");
		}
		const fetchCourses = async () => {
			// Fetch courses from API or database here
			try {
				const response = await axios.get(`${BACKEND_URL}/course/courses`, {
					withCredentials: true,
				});
				// console.log(response.data.courses);
				setCourses(response.data.courses);
				setLoading(false);
			} catch (error) {
				console.log(error, "Failed to fetch courses");
			}
		};
		fetchCourses();
	}, []);

	// Delete courses Code
	const handleDelete = async (courseId) => {
		try {
			const response = await axios.delete(`${BACKEND_URL}/course/delete/${courseId}`, {
				headers: { Authorization: `Bearer ${token}` },
				withCredentials: true,
			});
			toast.success(response.data.message);
			const updateCourses = courses.filter((course) => course._id !== courseId);
			setCourses(updateCourses);
		} catch (error) {
			console.log(error, "Failed to delete course");
			toast.error(error.response?.data?.errors || error.response.data?.message || "Front: Error in deleting Courses");
		}
	};

	if (loading) {
		return <p className="text-center text-gray-500">Loading...</p>;
	}

	return (
		<div className="bg-gray-100 p-8 space-y-4">
			<h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
			<Link className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300" to={"/admin/dashboard"}>
				Go to dashboard
			</Link>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
				{courses.map((course) => (
					<div key={course._id} className="bg-white shadow-md rounded-lg p-4">
						{/* Course Image */}
						<img src={course?.image?.url} alt={course.title} className="h-40 w-full object-contain rounded-t-lg" />
						{/* Course Title */}
						<h2 className="text-xl font-semibold mt-4 text-gray-800">{course.title}</h2>
						{/* Course Description */}
						<p className="text-gray-600 mt-2 text-sm">{course.description.length > 200 ? `${course.description.slice(0, 200)}...` : course.description}</p>
						{/* Course Price */}
						<div className="flex justify-between mt-4 text-gray-800 font-bold">
							<div>
								{" "}
								₹{course.price} <span className="line-through text-gray-500">₹300</span>
							</div>
							<div className="text-green-600 text-sm mt-2">10 % off</div>
						</div>

						<div className="flex justify-between">
							<Link to={`/admin/update-course/${course._id}`} className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600">
								Update
							</Link>
							<button onClick={() => handleDelete(course._id)} className="bg-red-500 text-white py-2 px-4 mt-4 cursor-pointer rounded hover:bg-red-600">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default OurCourses;
