import React, { useState } from 'react';
import SimulationForm from '../components/SimulationForm';
import ResultCard from '../components/ResultCard';


function Home() {
  const [result, setResult] = useState([]);

  return (
    <div className="min-h-screen bg-[#0d1321] py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-[#f0ebd8] mb-8"> TRADE SIMULATION</h1>
      <SimulationForm onResult={setResult} />
      <ResultCard result={result} />
    </div>
  );
}

export default Home;
