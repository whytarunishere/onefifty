import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Navbar() {
	return (
		<div className="NAVBAR mx-auto w-full max-w-[1000px] px-5">
			<div className="flex items-start justify-between gap-4 py-0">
				<div className="flex flex-col items-start">
					<Link to="/">
						<img src={logo} alt="150 Logo" className="block h-[75px] w-auto" />
					</Link>
					<p className="ml-1 mt-2 text-[1.05rem] font-bold text-[#111111]">
						The news, distilled.
					</p>
				</div>

				<nav className="mt-4 flex items-center text-[0.95rem] tracking-[1px] text-black">
					<Link to="/read" className="hover:underline">
						READ
					</Link>
					<span className="mx-3">|</span>
					<Link to="/write" className="hover:underline">
						WRITE
					</Link>
					<span className="mx-3">|</span>
					<Link to="/about" className="hover:underline">
						ABOUT
					</Link>
				</nav>
			</div>

			<nav className="mb-9 flex w-full flex-wrap justify-center gap-8 border-y border-[#111] py-3 text-[0.85rem] font-semibold uppercase tracking-[1px] text-[#111]">
				<Link to="/latest" className="transition-opacity duration-200 hover:opacity-60">
					Latest
				</Link>
				<Link
					to="/investigations"
					className="transition-opacity duration-200 hover:opacity-60"
				>
					Investigations
				</Link>
				<Link
					to="/corroborations"
					className="transition-opacity duration-200 hover:opacity-60"
				>
					Corroboration
				</Link>
				<Link to="/impact" className="transition-opacity duration-200 hover:opacity-60">
					Impact
				</Link>
			</nav>
		</div>
	);
}
