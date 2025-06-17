import Navbar from "../components/Navbar";
import AIChat from "../components/AI_Chat";
import Footer from "../components/Footer";

const AskAI = () => {
    return (
        <div className="relative min-h-screen overflow-clip flex flex-col justify-between">
            <title>Ask AI | TradeSim</title>

            {/* Background */}
            <div className="absolute inset-0 bg-gray-950">
                {/* Right-side blob */}
                <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full 
                bg-[radial-gradient(circle_farthest-side,rgba(117,0,74,.25),rgba(255,255,255,0))]" />

                {/* Left-side blob */}
                <div className="absolute top-1/2 left-[-20%] -translate-y-1/2 transform h-[750px] w-[750px] rounded-full 
                bg-[radial-gradient(circle_farthest-side,rgba(117,0,74,.35),rgba(255,255,255,0))]" />

                {/* Bottom-center blob */}
                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full opacity-40 blur-2xl
                bg-[radial-gradient(circle_farthest-side,rgba(74,0,74,0.15),transparent)] pointer-events-none" />
            </div>

            {/* Foreground content */}
            <div className="relative z-10 scroll-auto ">
                <Navbar />

                <div className="max-w-5/6 md:3/4 mx-auto my-4">
                    <AIChat />
                </div>
            </div>

            {/* Footer */}
            <div className="relative bottom-0 py-6">
                <Footer />
            </div>
        </div>
    );
};

export default AskAI;
