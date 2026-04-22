import { API_URL } from './config';

async function request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('fammerce_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        // Optional: logout user if token is invalid
        // localStorage.removeItem('fammerce_user');
        // localStorage.removeItem('fammerce_token');
        // window.location.href = '/login';
    }

    return response;
}

export const api = {
    get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
};
