import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBitcoinSign } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="w-full pt-2 border-b border-slate-800 text-slate-100 bg-transparent">
      <nav className="w-full max-w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/sim" className="flex items-center text-slate-100 font-bold text-lg md:text-2xl tracking-wider">
          <FaBitcoinSign className="text-lg sm:text:xl lg:text-2xl xl:text-4xl" />
          <span className="pl-1 sm:pl-2">
            Trade<span className="text-pink-500">Sim</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden text-sm sm:text-md lg:text-lg md:flex items-end space-x-6 py-4">
          <Link to="/" className="text-slate-300 hover:text-pink-500 transition-transform hover:scale-105">Home</Link>
          <Link to="/sim" className="text-slate-300 hover:text-pink-500 transition-transform hover:scale-105">Simulator</Link>
          <Link to="/about" className="text-slate-300 hover:text-pink-500 transition-transform hover:scale-105">About</Link>
          <Link to="/docs" className="text-slate-300 hover:text-pink-500 transition-transform hover:scale-105">Docs</Link>
          <Link to="/contact" className="text-slate-300 hover:text-pink-500 transition-transform hover:scale-105">Contact</Link>
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

      {/* Mobile Menu - always rendered */}
      <div
        className={`
          md:hidden absolute top-10 left-0 w-full z-50 rounded-md backdrop-blur-md
          bg-gradient-to-b from-pink-950/40 to-slate-900/10 border-b border-pink-500/10 shadow-xl
          transition-all duration-300 ease-out transform origin-top
          ${menuOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-end px-6 py-4 space-y-4">
          <Link to="/" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Home</Link>
          <Link to="/sim" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Simulator</Link>
          <Link to="/about" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">About</Link>
          <Link to="/docs" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Docs</Link>
          <Link to="/contact" onClick={handleLinkClick} className="text-slate-200 text-xs sm:text-sm hover:text-pink-500 transition-transform hover:translate-x-1">Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
