import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call

import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

	const handleLogout = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
				withCredentials: true,
			});
			toast.success(response?.data?.message || "Logged out successfully!");
			localStorage.removeItem("admin");
			if (isAdminLoggedIn) {
				toast.success("Logged out successfully!");
			}
		} catch (error) {
			console.log(error, "Error in logging out admin");
			toast.error(error.response.data.errors || "Failed to log out admin");
		}
	};
	// Toggle sidebar for mobile devices
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<div className="flex h-screen">
				{/* Hamburger menu button for mobile */}
				<button className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800" onClick={toggleSidebar}>
					{isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
				</button>
				{/* Sidebar */}
				<aside className={`fixed top-0 left-0 h-screen bg-gray-100 w-74 p-5 transform z-10 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
					<div className="w-64 bg-gray-100 p-5">
						<div className="flex items-center flex-col mb-10">
							<img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
							<h2 className="text-lg font-semibold mt-4">
								I'm
								<span className="pl-1.5 cursor-pointer text-red-600 hover:text-red-800 hover:text-2xl transition-all duration-300">Admin</span>
							</h2>
						</div>
						<nav className="flex flex-col space-y-4">
							<Link to="/admin/our-courses">
								<button className="w-full bg-green-700 hover:bg-green-600 cursor-pointer text-white py-2 rounded">Our Courses</button>
							</Link>
							<Link to="/admin/create-course">
								<button className="w-full bg-orange-500 hover:bg-blue-600 cursor-pointer text-white py-2 rounded">Create Course</button>
							</Link>

							<Link to="/">
								<button className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white py-2 rounded">Home</button>
							</Link>
							<Link to="/admin/login">
								<button onClick={handleLogout} className="w-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white py-2 rounded">
									Logout
								</button>
							</Link>
						</nav>
					</div>
				</aside>
				<div className="flex h-screen items-center justify-center ml-[40%]">Welcome!!!</div>
			</div>
		</>
	);
}

export default Dashboard;
