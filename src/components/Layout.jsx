import React from "react";
import { Outlet } from "react-router-dom";
import Section1 from "./Section1";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-[#f5f2f8] text-[#111111]">
            <Section1 />
            <Navbar />
            

            {/* Main content and footer sit OUTSIDE the header-wrapper for proper CSS centering */}
            <main className="mx-auto w-full max-w-[1000px] px-5">
                <p></p>
                {/*Child routes render right here. */}
                <Outlet />
            </main>

            <footer className="mx-auto w-full max-w-[1000px] px-5 pb-10 pt-5 text-left text-[0.85rem] text-[#777777]">
                <p>&copy; 2026 OneFifty. The news, distilled.</p>
            </footer>
        </div>
    )
}
