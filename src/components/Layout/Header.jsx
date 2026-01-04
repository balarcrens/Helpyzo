/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ label: "Home", path: "/" },
		{
			label: "Interior",
			dropdown: [
				{ label: "Kitchen", path: "/services/kitchen" },
				{ label: "Bathroom", path: "/services/bathroom" },
				{ label: "Living Room", path: "/services/living-room" },
			],
		},
		{
			label: "Exterior",
			dropdown: [
				{ label: "Roofing", path: "/services/roofing" },
				{ label: "Painting", path: "/services/painting" },
				{ label: "Windows", path: "/services/windows" },
			],
		},
		{
			label: "Lawn & Garden",
			dropdown: [
				{ label: "Landscaping", path: "/services/landscaping" },
				{ label: "Tree Care", path: "/services/tree-care" },
				{ label: "Irrigation", path: "/services/irrigation" },
			],
		},
		{
			label: "More",
			dropdown: [
				{ label: "About Us", path: "/about" },
				{ label: "Contact", path: "/contact" },
				{ label: "FAQ", path: "/faq" },
			],
		},
	];

	return (
		<header className="fixed top-0 z-50 w-full px-4 py-2 sm:px-6">
			<div className={`mx-auto max-w-7xl transition-all duration-500 rounded-4xl px-6 py-3 flex items-center justify-between ${isScrolled ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl"
				: "bg-black/20 backdrop-blur-none border border-white/5"
				}`} >
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2 shrink-0">
					<img src="/helpyZo.png" width={150} alt="HelpyZo" />
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-1 py-1">
					{navItems.map((item, i) => (
						<div key={i} className="relative" onMouseEnter={() => setActiveDropdown(item.label)}
							onMouseLeave={() => setActiveDropdown(null)} >
							{item.path ? (
								<NavLink to={item.path} className={({ isActive }) => `flex items-center gap-1.5 px-5 py-2 text-sm font-medium transition-all rounded-full ${isActive ? "bg-white/20 text-white" : "text-gray-200 hover:text-white hover:bg-white/5"}`} >
									{item.label}
								</NavLink>
							) : (
								<button className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-full text-gray-200 hover:text-white hover:bg-white/5">
									{item.label}
									<FiChevronDown className="text-xs opacity-70" />
								</button>
							)}

							{/* Dropdown */}
							<AnimatePresence>
								{item.dropdown && activeDropdown === item.label && (
									<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2" >
										{item.dropdown.map((sub, idx) => (
											<Link key={idx} to={sub.path} className="block px-4 py-2 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg transition-colors" >
												{sub.label}
											</Link>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					))}
				</nav>

				{/* Desktop Actions */}
				<div className="hidden lg:flex items-center gap-4">
					<Link
						to="/signin"
						className="border border-stone-400 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
					>
						Sign in
					</Link>

					<Link
						to="/login"
						className="bg-[#b4f481] hover:bg-[#9fe870] text-black px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#9fe870]/40"
					>
						Login
					</Link>
				</div>

				{/* Mobile Toggle */}
				<button
					className="lg:hidden text-white p-2"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="lg:hidden mt-4 mx-auto max-w-sm bg-stone-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl"
					>
						<div className="flex flex-col gap-4">
							{navItems.map((item, i) => (
								<div key={i}>
									<Link
										to={item.path || "#"}
										onClick={() => setIsMobileMenuOpen(false)}
										className="block text-gray-300 font-medium py-2 border-b border-white/5"
									>
										{item.label}
									</Link>

									{item.dropdown && (
										<div className="pl-4 mt-2 space-y-2">
											{item.dropdown.map((sub, idx) => (
												<Link
													key={idx}
													to={sub.path}
													onClick={() => setIsMobileMenuOpen(false)}
													className="block text-sm text-gray-400 hover:text-[#9fe870]"
												>
													{sub.label}
												</Link>
											))}
										</div>
									)}
								</div>
							))}

							<Link
								to="/join-pro"
								className="mt-4 bg-[#b4f481] text-black w-full py-4 rounded-2xl font-bold text-center"
							>
								Join Our Pro Network
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Header;