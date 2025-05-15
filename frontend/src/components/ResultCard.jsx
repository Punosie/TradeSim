function ResultCard({ result }) {
  if (!result || result.length === 0)
    return <p className="text-white text-center mt-4">No results.</p>;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {result.map((snap, idx) => (
        <div
          key={idx}
          className="bg-[#1d2d44] text-white border border-black rounded p-4 mb-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-2">📊 Snapshot {idx + 1}</h3>
          <hr/>
          <p>Best Bid: <span className="font-mono">{snap.best_bid}</span></p>
          <p>Best Ask: <span className="font-mono">{snap.best_ask}</span></p>
          <p>Latency: <span className="font-mono">{snap.latency} ms</span></p>
          <p>Average Fill Price: <span className="font-mono">{snap.avg_price.toFixed(2)}</span></p>
          <p>
            Slippage:{' '}
            <span className={snap.slippage > 0.5 ? 'text-red-600 font-semibold' : 'text-green-600'}>
              {snap.slippage.toFixed(3)}%
            </span>
          </p>
          <p>Final Price after Fee: <span className="font-mono">{snap.final_price.toFixed(2)}</span></p>
        </div>
      ))}
    </div>
  );
}

export default ResultCard;
