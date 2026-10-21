import { useState, useRef, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, ValidationModule } from "ag-grid-community";
import useWebSocket from "../hooks/useWebSocket";
import { WS_URL } from "../lib/api";
import { themes } from "../utils/ag_theme";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ...(import.meta.env.DEV ? [ValidationModule] : []),
]);

const defaultColDef = {
    sortable: true,
    filter: false,
    flex: 1,
    resizable: false,
    headerClass: "wrap-header",
    autoHeaderHeight: true,
};

const columnDefs = [
    { field: "price", headerName: "Price (USD)" },
    { field: "quantity", headerName: "Qty (BTC)" },
];

const getRowId = (params) => String(params.data.price);

const toRows = (levels) => levels.map(([price, quantity]) => ({ price: Number(price), quantity: Number(quantity) }));

const OrderBook = () => {
    const [book, setBook] = useState({ bids: [], asks: [] });
    const latest = useRef(null);
    const frame = useRef(0);

    // The feed can tick faster than the screen refreshes: keep only the newest
    // snapshot and render it at most once per animation frame.
    const onMessage = useCallback((data) => {
        if (!data.asks || !data.bids) return;
        latest.current = data;
        if (frame.current) return;
        frame.current = requestAnimationFrame(() => {
            frame.current = 0;
            const { bids, asks } = latest.current;
            setBook({ bids: toRows(bids), asks: toRows(asks) });
        });
    }, []);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    useWebSocket(WS_URL && `${WS_URL}/ws/okx`, onMessage);

    return (
        <div className="h-full w-full flex gap-2 md:gap-5">
            {/* Bids */}
            <div className="h-full w-full text-center">
                <span className="text-xs sm:text-base md:text-xl font-bold text-emerald-600">BIDS</span>
                <AgGridReact
                    theme={themes.bidTheme}
                    rowData={book.bids}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    suppressMovableColumns
                    suppressDragLeaveHidesColumns
                    animateRows={false}
                />
            </div>
            {/* Asks */}
            <div className="h-full w-full text-center">
                <span className="text-xs sm:text-base md:text-xl font-bold text-rose-600">ASKS</span>
                <AgGridReact
                    theme={themes.askTheme}
                    rowData={book.asks}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    suppressMovableColumns
                    suppressDragLeaveHidesColumns
                    animateRows={false}
                />
            </div>
        </div>
    );
};

export default OrderBook;
