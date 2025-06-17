import useAuth from "../hooks/useAuthHook";
import ChatWindow from "./ChatWindow";

const AIChat = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6 animate-in fade-in zoom-in duration-700">
                <p className="text-white text-center text-md xl:text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-slate-800 text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6 animate-in fade-in slide-in-from-top duration-700">
                <p className="text-red-500 text-center text-md xl:text-xl">
                    Please log in to use the AI assistant.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full text-center py-4 animate-in fade-in slide-in-from-bottom duration-700">
            <h1 className="text-2xl sm:text-3lg md:text-4xl font-bold text-slate-200 mb-4">
                AI <span className="text-pink-600">Assistant</span>
            </h1>
            <div className="w-full">
                <ChatWindow user={user} />
            </div>
        </div>
    );
};

export default AIChat;
