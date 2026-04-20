let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

export const request = async (path, method = "GET", body = {}, headers = {}) => {
    const options = {
        headers: {"content-type": "application/json", ...headers},
        method
    };
    if (method !== "GET" && method !== "DELETE") {
        options.body = JSON.stringify(body);
    }
    const resp = await fetch("/api" + path, options);
    if (resp.status === 401 && onUnauthorized && path !== "/auth/me" && path !== "/auth/login") {
        onUnauthorized();
    }
    return resp;
}

export const jsonRequest = async (path, headers = {}) => {
    const resp = await request(path, "GET", null, headers);
    return await resp.json();
}

export const postRequest = async (path, body = {}, headers = {}) => {
    const resp = await request(path, "POST", body, headers);
    if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${resp.status}`);
    }
    return await resp.json();
}

export const putRequest = async (path, body = {}, headers = {}) => {
    const resp = await request(path, "PUT", body, headers);
    if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${resp.status}`);
    }
    return await resp.json();
}

export const deleteRequest = async (path, headers = {}) => {
    const resp = await request(path, "DELETE", {}, headers);
    if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${resp.status}`);
    }
    return await resp.json();
}