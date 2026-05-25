import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1_white.png";

export default function Navbar({
  isWriting,
  setIsWriting,
  logoTo = "/dashboard",
  userName,
  userPhoto,
  onLogout,
}) {
  return (
    <div className="sticky top-0 z-50 w-full bg-[#FAFAFA]/95 backdrop-blur border-b-2 border-[#111111] text-[#111111]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 gap-4">
        <Link to={logoTo} className="shrink-0">
          <img src={logo} alt="Logo" className="h-12 md:h-14 w-auto brightness-0" />
        </Link>

        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          {userName ? (
            <div className="hidden md:flex items-center gap-2">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border border-[#ECECEC]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-[#ECECEC] bg-[#111111] text-white flex items-center justify-center font-serif text-sm">
                  {String(userName).charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6b6b6b]">
                {userName}
              </span>
            </div>
          ) : null}

          <button
            onClick={() => setIsWriting(!isWriting)}
            className="flex items-center gap-2 bg-[#D92D20] text-[#FAFAFA] px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors"
          >
            {isWriting ? (
              <>
                <ArrowLeft size={14} /> Back to Feed
              </>
            ) : (
              <>
                <Plus size={14} /> Create a Print
              </>
            )}
          </button>

          {onLogout ? (
            <button
              onClick={onLogout}
              className="border border-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
