import api from "./api";

export const getHoldings = async (portfolioId) => {
    const response = await api.get(`/holdings/${portfolioId}`);
    return response.data;
};

export const addHolding = async (portfolioId, holdingData) => {
    const response = await api.post(`/holdings/${portfolioId}`, holdingData);
    return response.data;
};

export const deleteHolding = async (holdingId) => {
    const response = await api.delete(`/holdings/${holdingId}`);
    return response.data;
};