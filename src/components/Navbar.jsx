import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1_white.png";

export default function Navbar() {
  return (
    <div className="w-full bg-black text-white">
      {/* Top Part: Logo and Primary Links */}
      <div className="flex items-center justify-between px-10 py-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-24 w-auto brightness-0 invert" />
        </Link>

        <nav className="flex gap-6 text-[0.8rem] tracking-[2px] font-light">
          <Link href="/read" className="hover:opacity-60">READ</Link>
          <span className="opacity-30">|</span>
          <Link href="/write" className="hover:opacity-60">WRITE</Link>
          <span className="opacity-30">|</span>
		  
          <Link href="/about" className="hover:opacity-60">ABOUT</Link>
        </nav>
      </div>

      {/* Bottom Part: Category Links */}
      <nav className="flex justify-center gap-10 border-t border-white/10 py-4 text-[0.75rem] uppercase tracking-widest text-white/70">
        <Link to="/latest" className="hover:text-white transition-colors">Latest</Link>
        <Link to="/investigations" className="hover:text-white transition-colors">Investigations</Link>
        <Link to="/impact" className="hover:text-white transition-colors">Impact</Link>
		<Link to="/corroborations" className="hover:text-white transition-colors">Corroborations</Link>
      </nav>
    </div>
  );
}