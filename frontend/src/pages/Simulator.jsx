import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TradeForm from "../components/TradeForm";
import TradeOutput from "../components/TradeOutput";
import { useState } from 'react';

const Simulator = () => {
    const [response, setResponse] = useState(null)
    return (
        <div className="relative min-h-screen overflow-clip flex flex-col justify-between">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gray-950">
                {/* Right-side blob */}
                <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full 
          bg-[radial-gradient(circle_farthest-side,rgba(117,0,74,.25),rgba(255,255,255,0))]">
                </div>

                {/* Left-side blob */}
                <div className="absolute top-1/2 left-[-20%] -translate-y-1/2 transform h-[750px] w-[750px] rounded-full 
          bg-[radial-gradient(circle_farthest-side,rgba(117,0,74,.35),rgba(255,255,255,0))]">
                </div>

                {/* Bottom-center blob */}
                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full opacity-40 blur-2xl
  bg-[radial-gradient(circle_farthest-side,rgba(74,0,74,0.15),transparent)] pointer-events-none">
                </div>
            </div>

            {/* Foreground content */}
            <div className="relative top-0 pb-2 z-10 ">
                <Navbar />
            </div>
            <div className="flex-grow">
                <div className="relative flex h-full flex-col px-4 space-y-40">
                    <div className="max-w-full text-center">
                        <h1 className="mb-8 font-bold tracking-wide sm:text-xl lg:text-3xl text-slate-200">
                            ORDERBOOK
                        </h1>
                    </div>
                    <div className="flex flex-wrap h-full gap-8 justify-around " >
                        <div className="flex-1 min-w-[315px] max-w-[450px] border rounded-md p-4 border-transparent" >
                            <span className=" text-slate-100 text-shadow-sm text-md md:text-lg xl:text-2xl text-center mb-4 p-2 block tracking-wide font-bold">TRADE CONFIGURATION</span>
                            <TradeForm onSubmitResponse={setResponse} />
                        </div>
                        <div className="flex-1 min-w-[315px] max-w-[450px] border rounded-md p-4 border-transparent" >
                            <span className="text-slate-100 text-md md:text-xl xl:text-2xl text-center mb-4 p-2 block tracking-wide font-bold">PREDICTION METRICS</span>
                            <TradeForm onSubmitResponse={setResponse} />
                        </div>
                        <div className="flex-1 min-w-[315px] max-w-[450px] border rounded-md p-4 border-transparent" >
                            <span className="text-slate-100 text-md md:text-xl xl:text-2xl text-center mb-4 p-2 block tracking-wide font-bold">TRADE OUTPUT</span>
                            <TradeOutput result={response} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative bottom-0 py-6">
                <Footer />
            </div>
        </div>
    );
};

export default Simulator;