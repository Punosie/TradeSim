import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full mt-auto px-6 py-4 border-t border-slate-700 text-slate-100 text-sm md:text-md lg:text-lg bg-transparent flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <span>Made with</span>
        <FaHeart className="text-red-500 animate-pulse" />
        <span>by <span className="font-semibold text-rose-400">Shubhankar Kaushik</span></span>
      </div>

      <div className="flex items-center gap-6 text-xl">
        <a href="https://github.com/Punosie" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-emerald-400 transition">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/shubhankar-kaushik/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-400 transition">
          <FaLinkedin />
        </a>
        <a href="https://x.com/pun0sie" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-blue-400 transition">
          <FaXTwitter />
        </a>
        <a href="https://www.instagram.com/shubhankar.2003/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition">
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
