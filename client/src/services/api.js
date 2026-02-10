const API_BASE_URL = "http://localhost:5000";

export async function registerUser(email, password, name) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function fetchPortfolio(token) {
    const response = await fetch(`${API_BASE_URL}/portfolio/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status !== 200) {
        throw new Error('Unauthorised')
    }

    return response.json();
}

export async function createPortfolio(token, name) {
    const response = await fetch(`${API_BASE_URL}/portfolio/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    })

    return response.json();
}

export async function fetchHoldings(token, portfolioId) {
    const response = await fetch(`${API_BASE_URL}/holdings/${portfolioId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status !== 200) {
        throw new Error('Unauthorised')
    }

    return response.json();
}