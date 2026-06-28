import api from "./api";

export async function getPortfolios() {
    return (await api.get("/portfolio/")).data;
}

export async function createPortfolio(name) {

    if (!name.trim()) {
        throw {
            msg: "Portfolio name is required.",
        };
    }

    return (
        await api.post("/portfolio/", {
            name: name.trim(),
        })
    ).data;
}

export async function deletePortfolio(id) {

    return (
        await api.delete(`/portfolio/${id}`)
    ).data;
}