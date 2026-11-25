const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers);
    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
            credentials: "include",
        });
    } catch {
        throw new Error("API server se connection nahi ho saka. Wifi chal raha hai ya nahi check karein.");
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json") && !contentType.includes("+json")) {
        const error = new Error(
            `API se JSON ke bajaye webpage mila (HTTP ${response.status}). Vercel par /api routing check karein.`
        );
        error.status = response.status;
        throw error;
    }

    let data;
    try {
        data = await response.json();
    } catch {
        const error = new Error("API se valid JSON response nahi mila.");
        error.status = response.status;
        throw error;
    }

    if (!response.ok) {
        const error = new Error(data.message || "Request complete nahi ho saki.");
        error.status = response.status;
        throw error;
    }

    return data;
}

export async function loginAdmin(email, password) {
    return apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function logoutAdmin() {
    return apiRequest("/admin/logout", { method: "POST" });
}

export async function fetchUsers() {
    const { users } = await apiRequest("/admin/users");
    return users.map((user) => ({
        ...user,
        id: String(user._id),
    }));
}

export async function setUserStatus(id, status) {
    return apiRequest(`/admin/users/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}
