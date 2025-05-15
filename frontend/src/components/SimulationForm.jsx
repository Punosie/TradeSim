import { useState } from 'react';
import axios from 'axios';

function SimulationForm({ onResult }) {
  const [rawInput, setRawInput] = useState('1000');
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Parses input like '10k', '1.5M', '500' into a number
  function parseAmount(value) {
    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
      if (value.endsWith('k')) {
        return parseFloat(value.slice(0, -1)) * 1_000;
      }
      if (value.endsWith('m')) {
        return parseFloat(value.slice(0, -1)) * 1_000_000;
      }
      return parseFloat(value);
    }
    return value;
  }

  const handleChange = (e) => {
    const val = e.target.value;
    setRawInput(val);
    const parsed = parseAmount(val);
    if (!isNaN(parsed)) {
      setAmount(parsed);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`http://localhost:8000/simulate?amount=${amount}`);
      console.log('Sending amount:', amount);
      onResult(res.data);
    } catch (err) {
      setError('Failed to fetch simulation results.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1d2d44] text-white shadow-md p-6 rounded-md mb-6 w-full max-w-2xl mx-auto"
    >
      {/* Inline label + input */}
      <div className="flex items-center gap-4">
        <label className="font-medium whitespace-nowrap">Amount (USDT):</label>
        <input
          type="text"
          value={rawInput}
          onChange={handleChange}
          className="border border-black px-3 py-1 rounded w-32"
          placeholder="e.g. 1000, 10k, 1.5M"
        />
      </div>

      {/* Info text below, full width */}
      <small className="block text-gray-300 mt-1">
        shorthand: k = thousand, M = million (e.g., 10k, 1.5M)
      </small>

      <button
        type="submit"
        className="bg-[#007200] px-4 py-1 rounded hover:bg-[#38b000] transition mt-4"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Simulation'}
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </form>
  );
}

export default SimulationForm;
