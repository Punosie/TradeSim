import { useNavigate } from 'react-router';
import { useState } from 'react';
import { signInWithGoogle, signInWithGithub, authErrorMessage } from '../utils/auth';
import useAuth from '../hooks/useAuthHook';
import Navbar from '../components/Navbar';
import Seo from '../components/Seo';

const Home = () => {
    const navigate = useNavigate();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [signInError, setSignInError] = useState(null);
    const { user, loading } = useAuth();

    const signIn = (provider) => async () => {
        if (isSigningIn) return;
        setIsSigningIn(true);
        setSignInError(null);
        try {
            await provider();
            navigate("/sim");
        } catch (error) {
            setSignInError(authErrorMessage(error));
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleGoogleSignIn = signIn(signInWithGoogle);
    const handleGithubSignIn = signIn(signInWithGithub);

    return (
        <div className="relative min-h-screen flex flex-col">
            <Seo description="Simulate crypto market orders on a live OKX order book. Analyze slippage, fees and market impact, and get a 60-second mid-price prediction." />

            {/* Background */}
            <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>

            {/* Navbar */}
            <div className="z-10">
                <Navbar />
            </div>

            {/* Main content fills remaining space */}
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="max-w-3xl text-center">
                    <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white flex justify-center gap-2">
                        <span className="text-emerald-400 animate-fade-up animate-duration-[1500ms] animate-delay-150 animate-ease-out">Predict.</span>
                        <span className="text-sky-400 animate-fade-up animate-duration-[1500ms] animate-delay-300 animate-ease-out">Trade.</span>
                        <span className="text-rose-400 animate-fade-up animate-duration-[1500ms] animate-delay-450 animate-ease-out">Win.</span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-sm md:text-lg xl:text-xl text-slate-300 animate-fade-up animate-duration-[1500ms] animate-delay-600 animate-ease-out">
                        Simulate your crypto trades with precision. Analyze slippage, fees, and market impact before you execute — built for traders, quants, and analysts.
                    </p>

                    {/* The hero renders immediately; only the sign-in buttons wait for auth state */}
                    { !loading && !user && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isSigningIn}
                            className="rounded-lg px-2 py-1 md:px-6 md:py-3 font-medium border-2 border-pink-700 text-slate-300 hover:bg-pink-800 hover:text-white duration-300 disabled:opacity-50"
                        >
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl">Sign in with Google</span>
                        </button>

                        <button
                            onClick={handleGithubSignIn}
                            disabled={isSigningIn}
                            className="rounded-lg px-2 py-1 md:px-6 md:py-3 font-medium border-2 border-sky-700 text-slate-300 hover:bg-sky-800 hover:text-white duration-300 disabled:opacity-50"
                        >
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl">Sign in with GitHub</span>
                        </button>
                    </div>
                    )}
                    {signInError && (
                        <p role="alert" className="mt-4 text-sm md:text-base text-rose-400">{signInError}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
