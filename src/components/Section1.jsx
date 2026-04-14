import React from "react";
import heroImg from "../assets/hero.jpg";

export default function Section1() {
	return (
		<section className="HERO mb-5 w-half">
			<div className="relative h-[80vh] w-full overflow-hidden bg-[#f00]">
				<img
					src={heroImg}
					alt="Voice of the people"
					className="h-full w-full object-cover object-[center_30%]"
				/>
				<div className="absolute inset-x-0 bottom-0 box-border bg-gradient-to-t from-black/85 via-black/40 to-transparent px-8 py-10">
					<h2 className="m-0 mb-3 font-serif text-4xl font-bold leading-[1.1] text-white md:text-[3.2rem]">
						BRUTALLY HONEST
						<br />
						UNWAVERINGLY HUMAN
					</h2>
					<p className="m-0 text-lg font-normal tracking-[.5px] text-[#dddddd] md:text-[1.2rem]">
						Amplifying the voices of the unheard across India.
					</p>
				</div>
			</div>
		</section>
	);
}
