import React, { useState, useEffect } from "react";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Home() {
	const [courses, setCourses] = useState([]);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setIsUserLoggedIn(true);
		} else {
			setIsUserLoggedIn(false);
		}
	}, []);

	useEffect(() => {
		const fetchCourses = async () => {
			// Fetch courses from API or database here
			try {
				const response = await axios.get(`${BACKEND_URL}/course/courses`, {
					withCredentials: true,
				});
				console.log("For Slides:", response.data.courses);
				setCourses(response.data.courses);
			} catch (error) {
				console.log(error, "Failed to fetch courses");
			}
		};
		fetchCourses();
	}, []);

	const handleLogout = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/user/logout`, {
				withCredentials: true,
			});
			toast.success(response.data.message);
			localStorage.removeItem("user");
			setIsUserLoggedIn(false);
		} catch (error) {
			console.log("Error in logging out", error);
			toast.error(error.response.data.errors || "Failed to logout");
		}
	};

	// Slider Setting

	var settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		initialSlide: 0,
		autoplay: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div className="bg-gradient-to-r from-black to-blue-950">
			<div className="h-screen text-white container mx-auto">
				{/* Header */}
				<header className="flex items-center justify-between p-6">
					<div className="flex items-center space-x-2">
						<img src={logo} alt="website-logo" className="w-10 h-10 rounded-full" />
						<Link to={"/"} className="text-2xl font-bold text-orange-500">
							CourseHeaven
						</Link>
					</div>
					<div className="space-x-4">
						{isUserLoggedIn ? (
							<button onClick={handleLogout} className="bg-transparent text-white py-2 px-4 border border-white rounded cursor-pointer">
								Logout
							</button>
						) : (
							<>
								<Link to={"/login"} className="bg-transparent text-white py-2 px-4 border border-white rounded">
									Login
								</Link>
								<Link to={"/signup"} className="bg-transparent text-white py-2 px-4 border border-white rounded">
									Signup
								</Link>
							</>
						)}
					</div>
				</header>

				{/* Main Section */}
				{/* section-1 */}
				<section className="text-center py-20">
					<h1 className="text-4xl font-semibold text-orange-500">CourseHeaven</h1>
					<br />
					<p className="text-gray-500">Lorem, ipsum dolor sit amet consectetur adipisicing.</p>
					<div className="space-x-4 mt-8">
						<Link to={"/courses"} className="bg-green-500 text-white rounded font-semibold hover:bg-white hover:text-black py-3 px-6 duration-300 cursor-pointer">
							Explore Courses
						</Link>
						<Link to={"https://www.udemy.com/"} className="hover:bg-green-500 hover:text-white rounded font-semibold bg-white text-black py-3 px-6 duration-300 cursor-pointer">
							Courses Videos
						</Link>
					</div>
				</section>
				{/* section-2 */}
				<section className="">
					<Slider {...settings}>
						{courses.map((course) => (
							<div key={course._id} className="p-4">
								<div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
									<div className="bg-gray-900 rounded-lg overflow-hidden">
										<img src={course.image.url} alt={course.title} className="object-contain w-full h-32 mt-4" />
										<div className="p-6 text-center">
											<h2 className="text-xl font-semibold text-white">{course.title}</h2>
											{/* <p className="text-gray-500">{course.description.slice(0, 100)}...</p> */}
											<button className="mt-4 text-white bg-orange-500 py-2 px-4 rounded-full hover:bg-blue-500 duration-300 cursor-pointer">Enroll Now</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</Slider>
				</section>

				<hr />

				{/* Footer */}
				<footer className="my-8">
					{/* Left Footer */}

					<div className="grid grid-cols-1 md:grid-cols-3">
						<div className="flex flex-col items-center md:items-start">
							<div className="flex items-center space-x-2">
								<img src={logo} alt="website-logo" className="w-10 h-10 rounded-full" />
								<h1 className="text-2xl font-semibold text-orange-500">CourseHeaven</h1>
							</div>
							<div className="mt-3 ml-2 md:ml-8">
								<p className="mb-2">Follow us</p>
								<div className="flex space-x-4">
									<a href="">
										<FaFacebook className="text-2xl hover:text-blue-500 duration-300" />
									</a>
									<a href="">
										<FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
									</a>
									<a href="">
										<FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
									</a>
								</div>
							</div>
						</div>

						{/* Center Footer */}

						<div className="flex flex-col items-center mt-4 md:items-start md:mt-0">
							<h3 className="text-lg font-semibold mb-4">Connects</h3>
							<ul className="space-y-2 text-gray-400 ">
								<li className="hover:text-white cursor-pointer duration-300">YouTube - Learn</li>
								<li className="hover:text-white cursor-pointer duration-300">Telegram - Learn</li>
								<li className="hover:text-white cursor-pointer duration-300">GitHub - Learn</li>
							</ul>
						</div>

						{/* Right Footer */}

						<div className="flex flex-col items-center mt-4 md:items-start md:mt-0">
							<h3 className="text-lg font-semibold mb-4">Copyrights &#169; {new Date().getFullYear()}</h3>
							<ul className="space-y-2 text-gray-400 ">
								<li className="hover:text-white cursor-pointer duration-300">Terms & Conditions</li>
								<li className="hover:text-white cursor-pointer duration-300">Privacy Policy</li>
								<li className="hover:text-white cursor-pointer duration-300">Refund Policy</li>
							</ul>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default Home;
