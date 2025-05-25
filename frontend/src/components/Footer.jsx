import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-screen px-4 pt-2 border-t-1 border-slate-800 text-slate-100 text-sm md:text-lg lg:text-xl bg-transparent flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <span>Made with</span>
        <FaHeart className="text-red-500" />
        <span>by Shubhankar Kaushik</span>
      </div>

      <div className="flex items-center gap-8 text-md md:text-lg lg:text-xl ">
        <a href="https://github.com/Punosie" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/shubhankar-kaushik/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://x.com/pun0sie" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <FaXTwitter />
        </a>
        <a href="https://www.instagram.com/shubhankar.2003/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
