import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackForm from '../components/FeedbackForm';
import {
    FaGithubAlt,
    FaLinkedin,
    FaSquareXTwitter,
    FaEnvelope,
} from 'react-icons/fa6';

const Contact = () => {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 -z-10 h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>
            </div>

            {/* Navbar */}
            <div className="relative z-50 top-0 pb-2">
                <Navbar />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-grow px-4 py-8 max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-center text-slate-200 md:mt-10">
                    Get in <span className="text-pink-400">Touch</span>
                </h1>

                <div className="mt-10 text-slate-300 text-center space-y-4 text-md md:text-lg">
                        <p className='animate-fade-right sm:animate-fade-up animate-duration-[1500] animate-delay-250'>Have a question, suggestion, or just want to say hello?</p>
                        <p className='animate-fade-right sm:animate-fade-up animate-duration-[1500] animate-delay-350'>
                            Feel free to reach out through any of the methods below. I’ll get
                            back to you as soon as possible!
                        </p>
                </div>

                {/* Contact Info Cards */}
                <div className="mt-6 md:mt-12 grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-4 text-center text-slate-100 animate-fade-up animate-duration-[1500ms] animate-delay-[300ms]">
                    {/* Email */}
                    <a
                        href="mailto:shubhankar.kaushik2003@gmail.com"
                        className="transition hover:-translate-y-1 hover:shadow-pink-400/30 hover:shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="bg-gradient-to-b from-pink-950/40 to-slate-900/10 backdrop-blur-md border border-pink-500/10 p-6 rounded-xl shadow-lg hover:bg-pink-950/60 transition">
                            <FaEnvelope className="text-2xl text-slate-200 mb-2 mx-auto" />
                            <p className="text-sm break-all">
                                Emial
                            </p>
                        </div>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://linkedin.com/in/shubhankar-kaushik"
                        className="transition hover:-translate-y-1 hover:shadow-blue-400/30 hover:shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="bg-gradient-to-b from-pink-950/40 to-slate-900/10 backdrop-blur-md border border-pink-500/10 p-6 rounded-xl shadow-lg hover:bg-pink-950/60 transition">
                            <FaLinkedin className="text-2xl text-blue-400 mb-2 mx-auto" />
                            <p className="text-sm break-all">
                                LinkedIn
                            </p>
                        </div>
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/Punosie"
                        className="transition hover:-translate-y-1 hover: shadow-amber-600/30 hover:shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="bg-gradient-to-b from-pink-950/40 to-slate-900/10 backdrop-blur-md border border-pink-500/10 p-6 rounded-xl shadow-lg hover:bg-pink-950/60 transition">
                            <FaGithubAlt className="text-2xl text-amber-600 mb-2 mx-auto" />
                            <p className="text-sm break-all">GitHub</p>
                        </div>
                    </a>

                    {/* Twitter / X */}
                    <a
                        href="https://x.com/Pun0sie"
                        className="transition hover:-translate-y-1 hover:shadow-white/20 hover:shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="bg-gradient-to-b from-pink-950/40 to-slate-900/10 backdrop-blur-md border border-pink-500/10 p-6 rounded-xl shadow-lg hover:bg-pink-950/60 transition">
                            <FaSquareXTwitter className="text-2xl text-slate-200 mb-2 mx-auto" />
                            <p className="text-sm break-all">Twitter</p>
                        </div>
                    </a>
                </div>

                {/* Feedback Form */}
                <div className=" mt-10 md:mt-10">
                    <FeedbackForm />
                </div>
            </div>
        </div>
    );
};

export default Contact;
