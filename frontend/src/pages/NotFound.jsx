import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import Seo from '../components/Seo';

const NotFound = () => {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Seo
                title="Page Not Found"
                description="The page you are looking for does not exist."
                noindex
            />
            <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>

            <div className="z-10">
                <Navbar />
            </div>

            <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-6xl md:text-8xl font-bold text-pink-500">404</h1>
                <p className="mt-4 text-slate-300 text-base md:text-xl">This page doesn't exist.</p>
                <Link
                    to="/"
                    className="mt-8 rounded-lg px-6 py-3 border-2 border-pink-700 text-slate-300 hover:bg-pink-800 hover:text-white duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
