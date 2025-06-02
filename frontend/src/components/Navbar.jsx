import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBitcoinSign } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import useAuth from "../hooks/useAuthHook";
import { Avatar } from "./Avatar";
import LoginDialog from "./LoginDialog";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { user } = useAuth();
  const loginRef = useRef();

  const handleLinkClick = () => setMenuOpen(false);

  // 👇 Close login dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginDialogOpen(false);
      }
    };
    if (loginDialogOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loginDialogOpen]);


  return (
    <header className="w-full pt-2 border-b border-slate-800 text-slate-100 bg-transparent relative">
      <nav className="w-full max-w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center text-slate-100 font-bold text-lg md:text-2xl tracking-wider">
          <FaBitcoinSign className="text-lg sm:text:xl lg:text-2xl xl:text-4xl" />
          <span className="pl-1 sm:pl-2">
            Trade<span className="text-pink-500">Sim</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="w-full ml-auto flex justify-end py-4">
          <div className="hidden md:flex items-center space-x-6 text-sm sm:text-md lg:text-lg">
            <NavLink to="/" className={({ isActive }) =>
              `flex items-center justify-center h-10 px-4 text-sm sm:text-md lg:text-lg transition-transform hover:scale-105 ${isActive ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-pink-500"
              }`}>
              Home
            </NavLink>
            <NavLink to="/sim" className={({ isActive }) =>
              `flex items-center justify-center h-10 px-4 text-sm sm:text-md lg:text-lg transition-transform hover:scale-105 ${isActive ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-pink-500"
              }`}>
              Simulator
            </NavLink>
            <NavLink to="/about" className={({ isActive }) =>
              `flex items-center justify-center h-10 px-4 text-sm sm:text-md lg:text-lg transition-transform hover:scale-105 ${isActive ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-pink-500"
              }`}>
              About
            </NavLink>
            <a
              href="https://punosie.github.io/TradeSim/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-10 px-4 text-slate-300 hover:text-pink-500 transition-transform hover:scale-105"
            >
              Docs
            </a>
            <NavLink to="/contact" className={({ isActive }) =>
              `flex items-center justify-center h-10 px-4 text-sm sm:text-md lg:text-lg transition-transform hover:scale-105 ${isActive ? "text-pink-500 font-semibold" : "text-slate-300 hover:text-pink-500"
              }`}>
              Contact
            </NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Avatar + LoginDialog */}
          <div className="relative hidden md:flex items-center">
            {user ? (
              <button onClick={() => setLoginDialogOpen((prev) => !prev)}>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  size={40}
                  className="rounded-full border-1 border-pink-500 hover:scale-105 transition-transform duration-300"
                />
              </button>
            ) : (
              <button
                onClick={() => setLoginDialogOpen((prev) => !prev)}
                className="rounded-lg border-1 border-pink-500 px-2 py-1 text-slate-300 hover:bg-pink-700 hover:text-white duration-300"
              >
                Login
              </button>
            )}
            {loginDialogOpen && (
              <div className="absolute top-14 right-0 z-50" ref={loginRef}>
                <LoginDialog ref={loginRef} closeDialog={() => setLoginDialogOpen(false)} />
              </div>
            )}
          </div>

        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-pink-500 hover:text-pink-500 focus:outline-none"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <HiX className="text-lg sm:text-xl" /> : <HiMenu className="text-lg sm:text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden absolute top-10 left-0 w-full z-50 rounded-md backdrop-blur-md
          bg-gradient-to-b from-pink-950/40 to-slate-900/10 border-b border-pink-500/10 shadow-xl
          transition-all duration-300 ease-out transform origin-top
          ${menuOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-end px-6 py-4 space-y-4">
          <NavLink to="/" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Home</NavLink>
          <NavLink to="/sim" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Simulator</NavLink>
          <NavLink to="/about" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">About</NavLink>
          <a
            href="https://punosie.github.io/TradeSim/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1"
          >
            Docs

          </a>
          <NavLink to="/contact" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Contact</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
