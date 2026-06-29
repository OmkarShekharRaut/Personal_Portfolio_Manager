import api from "./api";

/**
 * Get live market data for a ticker
 */
export async function getMarketData(ticker) {

    const response = await api.get(
        `/market/${ticker}`
    );

    return response.data;
}