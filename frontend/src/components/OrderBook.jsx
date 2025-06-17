import { useState, useEffect } from "react"
import { subscribeOrderbook } from "../services/OrderbookSocket";

import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { themes } from "../utils/ag_theme";

const WS_URL = import.meta.env.VITE_WS_URL

const OrderBook = () => {
    const [bids, setBids] = useState([]);
    const [asks, setAsks] = useState([]);
    const columnDefs = [
        { field: 'price', headerName: 'Price (USD)', sortable: true, filter: false, flex: 1, resizable: false, headerClass: 'wrap-header', autoHeaderHeight: true, },
        { field: 'quantity', headerName: 'Qty (BTC)', sortable: true, filter: false, flex: 1, resizable: false, headerClass: 'wrap-header', autoHeaderHeight: true, },
    ];

    const msgCallback = (data) => {
        if (data.asks && data.bids) {
            const transformedAsks = data.asks.map(([price, quantity]) => ({
                price,
                quantity,
            }));
            const transformedBids = data.bids.map(([price, quantity]) => ({
                price,
                quantity,
            }));

            setAsks(transformedAsks);
            setBids(transformedBids);
        } else {
            console.warn("Received data does not contain asks or bids:", data);
        }
    };


    useEffect(() => {
        const socket = subscribeOrderbook(WS_URL, msgCallback)
    }, [])


    return (
        <>
            <div className="h-full w-full flex gap-2 md:gap-5">
                {/* Bids */}
                <div className="h-full w-full ag-theme-material text-center ">
                    <span className="text-xs sm:text-md md:text-xl font-bold text-emerald-600">BIDS</span>
                    <AgGridReact
                        theme={themes.bidTheme}
                        rowData={bids}
                        columnDefs={columnDefs}
                        getRowId={(params) => params.data.price.toString()}
                        suppressMovableColumns={true}
                        suppressDragLeaveHidesColumns={true}
                        animateRows={false}
                    />
                </div>
                {/* Asks */}
                <div className="h-full w-full ag-theme-material text-center ">
                    <span className="text-xs sm:text-md md:text-xl font-bold text-rose-600 ">ASKS</span>
                    <AgGridReact
                        theme={themes.askTheme}
                        rowData={asks}
                        columnDefs={columnDefs}
                        getRowId={(params) => params.data.price.toString()}
                        suppressMovableColumns={true}
                        suppressDragLeaveHidesColumns={true}
                        animateRows={false}
                    />
                </div>
            </div>
        </>
    )
}

export default OrderBook