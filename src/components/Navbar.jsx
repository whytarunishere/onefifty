import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1_white.png";

export default function Navbar({ isWriting, setIsWriting }) {
  return (
    <div className="sticky top-0 z-50 w-full bg-black text-white border-b border-white/10">
      <div className="flex items-center justify-between px-10 py-2">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-20 w-auto brightness-0 invert" />
        </Link>

        <button 
          onClick={() => setIsWriting(!isWriting)}
          className="flex items-center gap-2 bg-amber-500 text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
        >
          {isWriting ? (
            <><ArrowLeft size={14} /> Back to Feed</>
          ) : (
            <><Plus size={14} /> Create a Print</>
          )}
        </button>
      </div>
    </div>
  );
}
