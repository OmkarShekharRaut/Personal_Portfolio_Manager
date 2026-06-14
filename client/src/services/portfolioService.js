import api from "./api";

export const getPortfolios = async () => {
    const response = await api.get("/portfolio/");
    return response.data;
};

export const createPortfolio = async (name) => {
    const response = await api.post("/portfolio/", {
        name,
    });

    return response.data;
};

export const deletePortfolio = async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
}