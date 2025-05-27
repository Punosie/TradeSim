const TradeOutput = ({ result }) => {
    return (
        <div className="bg-slate-800 text-sm md:text-lg rounded-xl p-6 shadow-md w-full mx-auto mt-6">
            {!result ? (
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
            ) : (
                <>
                    <h2
                        className={`text-center text-xs md:text-sm xl:text-lg ${result.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                            } font-semibold mb-4`}
                    >
                        {result.status === 'success' ? 'Trade Successful' : 'Trade Failed'}
                    </h2>
                    <div className="grid gap-y-2 text-xs md:text-sm xl:text-lg">
                        {[
                            "exchange",
                            "asset",
                            "order_type",
                            "qty_usd",
                            "filled_qty",
                            "average_price",
                            "total_spent",
                        ].map((key) => (
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
    );
}

export default TradeOutput;