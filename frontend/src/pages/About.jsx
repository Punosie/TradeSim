import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <title>About | TradeSim</title>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-50 top-0 pb-2">
        <Navbar />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow px-4 py-8 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-slate-200 mt-10">
          The <span className="text-pink-400">Simulator</span>
        </h1>

        <div className=" text-xs md:text-md xl:text-xl text-slate-300 text-justify mt-8 space-y-6">
          <p className='animate-fade-right animate-duration-[1500ms] animate-delay-150 animate-ease-out'>
            This simulator was created to help me understand how a trading platform works — including the order book mechanics, trade execution flows, and prediction-based decision-making.
          </p>

          <p className='animate-fade-right animate-duration-[1500ms] animate-delay-200'>
            It's a simplified replica of real-world crypto trading platforms. You can simulate placing trades, view the virtual order book, and analyze prediction metrics.
          </p>

          <p className='animate-fade-right animate-duration-[1500ms] animate-delay-250'>
            The goal is to learn by building. This project reflects my journey of understanding trading strategies, APIs, and full-stack integration.
            Feedback and contributions are always welcome!
          </p>
        </div>
        {/* TechStack */}
        {/* TechStack */}
        <hr className="border-t border-pink-600 my-12 w-full mx-auto opacity-50" />
        <div className="mt-10 text-slate-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-pink-500">
            Tech Stack
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center text-sm sm:text-md md:text-lg text-slate-300">
            {[
              { name: 'Python', shadow: 'hover:shadow-yellow-400/30' },
              { name: 'FastAPI', shadow: 'hover:shadow-emerald-400/30' },
              { name: 'React.js', shadow: 'hover:shadow-blue-400/30' },
              { name: 'Vite', shadow: 'hover:shadow-purple-400/30' },
              { name: 'Tailwind CSS', shadow: 'hover:shadow-cyan-400/30' },
              { name: 'AG Grid', shadow: 'hover:shadow-pink-400/30' },
              { name: 'Postman', shadow: 'hover:shadow-orange-400/30' },
              { name: 'WebSockets', shadow: 'hover:shadow-teal-400/30' },
            ].map((tech, idx) => (
              <li
                key={idx}
                style={{ animationDelay: `${250 + idx * 50}ms` }}
                className={`animate-fade-up animate-once animate-duration-[1500ms] animate-ease-out
          bg-gradient-to-b from-pink-950/40 to-slate-900/10
          backdrop-blur-md border border-pink-500/10
          p-4 rounded-xl shadow-lg transition duration-300
          transform hover:scale-105 hover:bg-pink-950/60 ${tech.shadow}`}
              >
                {tech.name}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 top-0 pb-2">
        <Footer />
      </div>
    </div>
  );
};

export default About;
