import api from "./api";

/**
 * Get live quote for a single ticker
 */
export async function getMarketData(ticker) {
    const response = await api.get(`/market/${ticker}`);
    return response.data;
}

/**
 * Get portfolio summary with live prices
 */
export async function getPortfolioSummary(portfolioId) {
    const response = await api.get(
        `/market/portfolio/${portfolioId}`
    );

    return response.data;
}