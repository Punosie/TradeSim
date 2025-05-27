import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="relative h-screen">
            <div className="absolute inset-0">
                <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_50%,#d07_120%)]"></div>
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <div className="max-w-3xl text-center">
                    <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
                        <span className="text-emerald-400"> Predict.</span>
                        <span className="text-sky-400"> Trade.</span>
                        <span className="text-rose-400"> Win.</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-sm md:text-lg xl:text-xl text-slate-300">
                        Simulate your crypto trades with precision. Analyze slippage, fees, and market impact before you execute — built for traders, quants, and analysts.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/sim" >
                            <button className="rounded-lg px-2 py-1 md:px-6 md:py-3 font-medium border-2 border-pink-900 text-slate-300 hover:bg-pink-800 hover:text-slate-100 duration-350">
                                <span className="text-sm sm:text-md md:text-lg lg:text-xl">Get started</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
