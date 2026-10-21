import { useState } from "react";
import { signInWithGoogle, signInWithGithub, signOut, authErrorMessage } from "../utils/auth";
import { FaGoogle, FaGithubAlt } from "react-icons/fa6";
import useAuth from "../hooks/useAuthHook";

const LoginDialog = ({ closeDialog }) => {
    const { user } = useAuth();
    const [error, setError] = useState(null);

    const signIn = (provider) => async () => {
        setError(null);
        try {
            await provider();
            closeDialog();
        } catch (err) {
            setError(authErrorMessage(err));
        }
    };

    const handleGoogleSignIn = signIn(signInWithGoogle);
    const handleGithubSignIn = signIn(signInWithGithub);

    const handleLogout = async () => {
        try {
            await signOut();
            closeDialog(); // ✅ close after logout
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return (
        <div className="rounded-md backdrop-blur-md bg-gradient-to-b from-pink-950/40 to-slate-900/10 border border-pink-500/10 shadow-xl p-4 space-y-4 min-w-[200px]">
            {user ? (
                <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-2 font-medium border border-gray-700 text-slate-300 hover:bg-gray-800 hover:text-white duration-300"
                >
                    Log Out
                </button>
            ) : (
                <div className="gap-4 flex justify-around">
                    <button
                        onClick={handleGoogleSignIn}
                        className="rounded-lg px-4 py-2 font-medium border border-emerald-700 text-slate-300 hover:bg-emerald-800 hover:text-white duration-300"
                    >
                        <FaGoogle />
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        className="rounded-lg px-4 py-2 font-medium border border-sky-700 text-slate-300 hover:bg-sky-800 hover:text-white duration-300"
                    >
                        <FaGithubAlt />
                    </button>
                </div>
            )}
            {error && (
                <p role="alert" className="text-xs text-rose-400 max-w-[220px]">{error}</p>
            )}
        </div>
    );
};

export default LoginDialog;
