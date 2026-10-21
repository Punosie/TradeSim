import { useState, useCallback } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { WS_URL } from "../lib/api";

const Prediction = () => {
    const [mpPred, setMpPred] = useState(null);

    const onMessage = useCallback((data) => {
        if (data?.prediction) setMpPred(data.prediction[0]);
    }, []);

    useWebSocket(WS_URL && `${WS_URL}/ws/prediction`, onMessage);

    return (
        <div className="bg-slate-800 text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6">
            {mpPred === null ? (
                <p className="text-slate-400 font-medium leading-loose text-center">
                    <span className="block text-slate-300 font-semibold">
                        No prediction received yet.
                    </span>
                    <span className="block text-slate-300">
                        Waiting for incoming prediction data...
                    </span>
                    <span className="block text-emerald-400 font-semibold">
                        Stay tuned!
                    </span>
                </p>
            ) : (
                <>
                    <h2 className="text-center text-xs md:text-sm xl:text-lg text-emerald-400 font-semibold mb-4">
                        Live Mid-Price Prediction
                    </h2>
                    <div className="grid gap-y-2 text-xs md:text-sm xl:text-lg">
                        <div className="grid grid-cols-2 border-b border-slate-700 pb-1">
                            <div className="text-slate-400 font-medium tracking-wide">
                                60 sec
                            </div>
                            <div className="text-slate-200 font-semibold text-right break-all">
                                {Number(mpPred).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
}

export default Prediction;