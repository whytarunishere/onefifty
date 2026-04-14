import React from "react";
import heroImg from "../assets/hero.jpg";

export default function Section1() {
	return (
		<section className="HERO px-0 py-0">
			<div className="relative h-[80vh] w-full overflow-hidden bg-[#111]">
				<img
					src={heroImg}
					alt="Voice of the people"
					className="h-full w-full object-cover object-[center_30%]"
				/>
				{/* This creates the cinematic fade-to-black at the bottom */}
				<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

				<div className="absolute inset-x-0 bottom-0 px-10 py-12">
					<h2 className="font-serif text-5xl font-bold leading-tight text-white">
						BRUTALLY HONEST <br /> UNWAVERINGLY HUMAN
					</h2>
					<p className="mt-4 text-lg text-white/80 max-w-xl">
						Amplifying the voices of the unheard across India.
					</p>
				</div>
			</div>
		</section>
	);
}

