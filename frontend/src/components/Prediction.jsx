import { useState, useEffect } from "react";
import { subscribeMidPricePred } from "../services/MidPricePred";

const WS_URL = import.meta.env.VITE_MP_PRED_URL;

const Prediction = () => {
    const [mpPred, setMpPred] = useState([]);

    const msgCallback = (data) => {
        if (data && data.prediction) {
            setMpPred(data.prediction[0]);
        }
        else {
            console.warn("Received data does not contain prediction:", data, typeof data);
        }
    }

    useEffect(() => {
        const socket = subscribeMidPricePred(WS_URL, msgCallback);
        console.log("Subscribed to prediction updates");
        return () => {
            socket.close();
            console.log("Unsubscribed from prediction updates");
        };
    }, []);

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
                        Live Midpoint Prediction
                    </h2>
                    <div className="grid gap-y-2 text-xs md:text-sm xl:text-lg">
                        <div className="grid grid-cols-2 border-b border-slate-700 pb-1">
                            <div className="text-slate-400 font-medium tracking-wide">
                                60 sec
                            </div>
                            <div className="text-slate-200 font-semibold text-right break-all">
                                {Number(mpPred).toLocaleString(undefined, {
                                    maximumFractionDigits: 8,
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