import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithGithub } from '../utils/auth'

const Home = () => {

    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate("/sim");
        } catch (error) {
            console.error("Google sign-in failed:", error);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            await signInWithGithub();
            navigate("/sim");
        } catch (error) {
            console.error("GitHub sign-in failed:", error);
        }
    };

    return (
        <div className="relative h-screen">
            <div className="absolute inset-0">
                <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <div className="max-w-3xl text-center">
                    <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white flex justify-center gap-2">
                        <span className="text-emerald-400 animate-fade-up animate-duration-[1500ms] animate-delay-150 animate-ease-out">Predict.</span>
                        <span className="text-sky-400 animate-fade-up animate-duration-[1500ms] animate-delay-300 animate-ease-out">Trade.</span>
                        <span className="text-rose-400 animate-fade-up animate-duration-[1500ms] animate-delay-450 animate-ease-out">Win.</span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-sm md:text-lg xl:text-xl text-slate-300 animate-fade-up animate-duration-[1500ms] animate-delay-600 animate-ease-out">
                        Simulate your crypto trades with precision. Analyze slippage, fees, and market impact before you execute — built for traders, quants, and analysts.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleGoogleSignIn}
                            className="rounded-lg px-2 py-1 md:px-6 md:py-3 font-medium border-2 border-pink-700 text-slate-300 hover:bg-pink-800 hover:text-white duration-300"
                        >
                            <span className="text-sm sm:text-md md:text-lg lg:text-xl">Sign in with Google</span>
                        </button>

                        <button
                            onClick={handleGithubSignIn}
                            className="rounded-lg px-2 py-1 md:px-6 md:py-3 font-medium border-2 border-sky-700 text-slate-300 hover:bg-sky-800 hover:text-white duration-300"
                        >
                            <span className="text-sm sm:text-md md:text-lg lg:text-xl">Sign in with GitHub</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home
