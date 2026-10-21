import { useState } from "react";
import useAuth from "../hooks/useAuthHook";
import api from "../lib/api";

const RESULT_FIELDS = [
    "exchange",
    "asset",
    "order_type",
    "qty_usd",
    "side",
    "filled_qty",
    "average_price",
    "total_value",
];

const TradeOutput = ({ result }) => {
    const { user, loading } = useAuth();
    const [downloadError, setDownloadError] = useState("");

    if (loading) {
        return (
            <div className="text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6">
                <p className="text-white text-center text-base xl:text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-slate-800 text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6">
                <p className="text-red-500 text-sm md:text-base xl:text-xl text-center">
                    Please log in to submit a trade and view the output.
                </p>
            </div>
        );
    }

    const isSubmitDisabled = !user;

    const handleclick = async () => {
        setDownloadError("");
        try {
            const response = await api.get("/trade-history", { responseType: "blob" });

            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "trade_history.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setDownloadError(
                err?.response?.status === 404
                    ? "No trades yet. Submit a trade first."
                    : "Failed to download trade history."
            );
        }
    };


    return (
        <>
            <div className="bg-slate-800 text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6">
                {!result ? (
                    <>
                        <p className="text-slate-400 font-medium leading-loose text-center">
                            <span className="block text-slate-300 font-semibold">
                                No trade submitted yet.
                            </span>
                            <span className="block text-slate-300">
                                Please submit a trade to see the output.
                            </span>
                            <span className="block text-emerald-400 font-semibold">
                                Happy Trading!
                            </span>
                        </p>
                    </>

                ) : result.error ? (
                    <p className="text-rose-400 font-semibold text-center text-xs md:text-sm xl:text-lg">
                        {result.error}
                    </p>
                ) : (
                    <>
                        <h2
                            className={`text-center text-xs md:text-sm xl:text-lg ${result.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                                } font-semibold mb-4`}
                        >
                            {result.status === 'success' ? 'Trade Successful' : 'Trade Failed'}
                        </h2>
                        <div className="grid gap-y-2 bg text-xs md:text-sm xl:text-lg">
                            {RESULT_FIELDS.map((key) => (
                                <div
                                    className="grid grid-cols-2 border-b border-slate-700 pb-1"
                                    key={key}
                                >
                                    <div className="text-slate-400 font-medium tracking-wide">
                                        {key.replace(/_/g, " ").toUpperCase()}
                                    </div>
                                    <div className="text-slate-200 font-semibold text-right break-all">
                                        {typeof result[key] === "number"
                                            ? Number(result[key]).toLocaleString(undefined, {
                                                maximumFractionDigits: 8,
                                            })
                                            : String(result[key])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {downloadError && (
                <p className="text-rose-400 text-xs md:text-sm text-center mt-2">{downloadError}</p>
            )}
            <button
                type="button"
                onClick={handleclick}
                className={`m-2 md:mt-6 w-full p-1.5 md:p-2 border text-xs sm:text-sm md:text-base xl:text-lg rounded-md transition duration-300 ${(isSubmitDisabled)
                    ? 'border-slate-500 text-slate-400 cursor-not-allowed'
                    : 'border-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                disabled={isSubmitDisabled}
                aria-label="Download All Trades"
            >
                <span className="">Download Trade History</span>
            </button>
        </>
    );
}

export default TradeOutput;