import api from "./api";

export async function getHoldings(portfolioId) {

    return (
        await api.get(`/holdings/${portfolioId}`)
    ).data;
}

export async function addHolding(
    portfolioId,
    holding
) {

    holding.ticker =
        holding.ticker.toUpperCase().trim();

    return (
        await api.post(
            `/holdings/${portfolioId}`,
            holding
        )
    ).data;
}

export async function updateHolding(
    holdingId,
    holding
) {

    holding.ticker =
        holding.ticker.toUpperCase().trim();

    return (
        await api.put(
            `/holdings/${holdingId}`,
            holding
        )
    ).data;
}

export async function deleteHolding(
    holdingId
) {

    return (
        await api.delete(
            `/holdings/${holdingId}`
        )
    ).data;
}