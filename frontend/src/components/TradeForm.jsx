import { useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_SIM_API_URL

const TradeForm = ({ onSubmitResponse }) => {
    const [formData, setFormData] = useState({
        exchange: 'OKX',
        asset: 'BTC-USDT-SWAP',
        order_type: 'market',
        qty_usd: '1000'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("Form submitted with data:", formData)
        if (!API_URL) {
            console.error("API URL is not defined")
            return
        }

        try {
            const res = await axios.post(`${API_URL}`, formData)
            console.log("Response from API:", res.data)
            onSubmitResponse(res.data)
        }
        catch (err) {
            console.error("Error submitting form:", err)
            onSubmitResponse({ error: "API request failed" })
        }
        finally {
            setFormData({
                exchange: 'OKX',
                asset: 'BTC-USDT-SWAP',
                order_type: 'market',
                qty_usd: '1000'
            })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 md:gap-4">
                    <label className="text-slate-200 text-xs md:text-sm xl:text-lg">
                        <span className="font-bold">EXCHANGE</span>
                        <select
                            name="exchange"
                            value={formData.exchange}
                            onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                            className="w-full m-1 md:mt-2 p-1 md:p-2 bg-slate-800 text-slate-200 text-xs md:text-sm xl:text-lg rounded-md">
                            <option value="OKX">OKX</option>
                        </select>
                    </label>
                    <label className="text-slate-200 text-xs md:text-sm xl:text-lg">
                        <span className="font-bold">SPOT ASSET</span>
                        <select
                            name="asset"
                            value={formData.asset}
                            onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                            className="w-full m-1 md:mt-2 p-1 md:p-2 bg-slate-800 text-slate-200 text-xs md:text-sm xl:text-lg rounded-md">
                            <option value="BTC-USDT-SWAP">BTC-USDT-SWAP</option>
                        </select>
                    </label>
                    <label className="text-slate-200 text-xs md:text-sm xl:text-lg">
                        <span className="font-bold">ORDER TYPE</span>
                        <select
                            name="order_type"
                            value={formData.order_type}
                            onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
                            className="w-full m-1 md:mt-2 p-1 md:p-2 bg-slate-800 text-slate-200 text-xs md:text-sm xl:text-lg rounded-md">
                            <option value="market">Market</option>
                        </select>
                    </label>
                    <label className="text-slate-200 text-xs md:text-sm xl:text-lg">
                        <span className="font-bold">QUANTITY (USD)</span>
                        <input
                            type="number"
                            className="w-full m-1 md:mt-2 p-1.5 md:p-2 bg-slate-800 text-slate-200 text-xs md:text-sm xl:text-lg rounded-md"
                            value={formData.qty_usd}
                            onChange={(e) => setFormData({ ...formData, qty_usd: e.target.value })}
                            placeholder="Enter quantity in USD"
                            min="1"
                            step="1"
                            required
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className={`m-2 md:mt-6 w-full p-1.5 md:p-2 border text-xs sm:text-sm md:text-md xl:text-lg rounded-md transition duration-300 ${!formData.qty_usd || formData.qty_usd <= 0
                        ? 'border-slate-500 text-slate-400 cursor-not-allowed'
                        : 'border-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                    disabled={!formData.qty_usd || formData.qty_usd <= 0}
                    aria-label="Submit Trade"
                >
                    <span className="">SUBMIT TRADE</span>
                </button>
            </form>
        </>
    )
}

export default TradeForm