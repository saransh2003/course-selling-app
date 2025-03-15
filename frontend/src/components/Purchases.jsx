import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
	const [purchases, setPurchases] = useState([]);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	// const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	// User and Token Section
	const user = JSON.parse(localStorage.getItem("user"));
	const token = user?.token; // using optional chaining to avoid app crashing
	// console.log("User (Purchase): ", user);
	// console.log("Token (Purchase): ", token);

	console.log("Purchases: ", purchases);

	useEffect(() => {
		if (token) {
			setIsUserLoggedIn(true);
		} else {
			setIsUserLoggedIn(false);
		}
	}, []);

	// if(!token) {
	// 	navigate("/login");
	// }

	useEffect(() => {
		const fetchPurchases = async () => {
			if (!token) {
				setErrorMessage("Please login to purchase the course");
				return;
			}
			// Fetch courses from API or database here
			try {
				const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
					headers: { Authorization: `Bearer ${token}` },
					withCredentials: true,
				});
				setPurchases(response.data.courseData);
			} catch (error) {
				setErrorMessage(error.response.data.errors || "Failed to fetch purchase data");
			}
		};
		fetchPurchases();
	}, []);

	const handleLogout = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/user/logout`, {
				withCredentials: true,
			});
			toast.success(response.data.message);
			localStorage.removeItem("user");
			navigate("/login");
			setIsUserLoggedIn(false);
		} catch (error) {
			console.log("Error in logging out", error);
			toast.error(error.response.data.errors || "Failed to logout");
		}
	};

	// Toggle sidebar for mobile devices
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}>
				<nav>
					<ul className="mt-16 md:mt-0">
						<li className="mb-4">
							<Link to="/" className="flex items-center">
								<RiHome2Fill className="mr-2" /> Home
							</Link>
						</li>
						<li className="mb-4">
							<Link to="/courses" className="flex items-center">
								<FaDiscourse className="mr-2" /> Courses
							</Link>
						</li>
						<li className="mb-4">
							<a href="#" className="flex items-center text-blue-500">
								<FaDownload className="mr-2" /> Purchases
							</a>
						</li>
						<li className="mb-4">
							<Link to="/" className="flex items-center">
								<IoMdSettings className="mr-2" /> Settings
							</Link>
						</li>
						<li>
							{isUserLoggedIn ? (
								<button onClick={handleLogout} className="flex items-center cursor-pointer">
									<IoLogOut className="mr-2" /> Logout
								</button>
							) : (
								<Link to="/login" className="flex items-center">
									<IoLogIn className="mr-2" /> Login
								</Link>
							)}
						</li>
					</ul>
				</nav>
			</div>

			{/* Sidebar Toggle Button (Mobile) */}
			<button className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg" onClick={toggleSidebar}>
				{isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
			</button>

			{/* Main Content */}
			<div className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
				<h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">My Purchases</h2>

				{/* Error message */}
				{errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

				{/* Render purchases */}
				{purchases.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{purchases.map((purchase, index) => (
							<div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
								<div className="flex flex-col items-center space-y-4">
									{/* Course Image */}
									<img className="rounded-lg w-full h-48 object-contain" src={purchase.image?.url || "https://via.placeholder.com/200"} alt={purchase.title} />
									<div className="text-center">
										<h3 className="text-lg font-bold">{purchase.title}</h3>
										<p className="text-gray-500">{purchase.description.length > 100 ? `${purchase.description.slice(0, 100)}...` : purchase.description}</p>
										<span className="text-green-700 font-semibold text-sm">₹ {purchase.price} only</span>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">You have no purchases yet.</p>
				)}
			</div>
		</div>
	);
}

export default Purchases;
