import { API_BASE_URL } from '../constants';

// Store credentials in memory for HTTP Basic Auth
let authCredentials: { username: string; password: string } | null = null;

export const setAuthCredentials = (username: string, password: string) => {
    authCredentials = { username, password };
};

export const clearAuthCredentials = () => {
    authCredentials = null;
};

export const getAuthCredentials = () => authCredentials;

interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T }> {
        const { params, headers: customHeaders, ...rest } = options;

        // Construct URL with query parameters
        let url = `${API_BASE_URL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value.toString());
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        // Setup headers
        const headers = new Headers(customHeaders);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        // Authorization interceptor
        if (authCredentials) {
            const token = btoa(`${authCredentials.username}:${authCredentials.password}`);
            headers.set('Authorization', `Basic ${token}`);
        }

        const response = await fetch(url, {
            ...rest,
            headers,
        });

        // Response handling
        if (response.status === 401) {
            clearAuthCredentials();
        }

        if (!response.ok) {
            let errorMessage = `Request failed with status ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // Fallback to text if JSON parsing fails
                const text = await response.text().catch(() => '');
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }

        // Parsing JSON safely
        const contentType = response.headers.get('content-type');
        let data: any = null;
        if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};
        }

        return { data };
    }

    async get<T>(url: string, options: RequestOptions = {}) {
        return this.request<T>(url, { ...options, method: 'GET' });
    }

    async post<T>(url: string, body?: any, options: RequestOptions = {}) {
        return this.request<T>(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async put<T>(url: string, body?: any, options: RequestOptions = {}) {
        return this.request<T>(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async delete<T>(url: string, options: RequestOptions = {}) {
        return this.request<T>(url, { ...options, method: 'DELETE' });
    }
}

const apiClient = new ApiClient();
export default apiClient;
