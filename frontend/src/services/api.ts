import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (email: string, username: string, password: string) => {
        const response = await api.post('/auth/register', { email, username, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data.user;
    },

    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },
};

// Reports API
export const reportsAPI = {
    create: async (data: {
        latitude: number;
        longitude: number;
        decibel_level: number;
        noise_category: string;
        noise_source?: string;
        description?: string;
        timestamp: string;
    }) => {
        const response = await api.post('/reports', data);
        return response.data;
    },

    getAll: async (params?: {
        city?: string;
        limit?: number;
        offset?: number;
        category?: string;
        source?: string;
        since?: string;
    }) => {
        const response = await api.get('/reports', { params });
        return response.data;
    },

    getNearby: async (latitude: number, longitude: number, radius?: number) => {
        const response = await api.get('/reports/nearby', {
            params: { latitude, longitude, radius },
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/reports/${id}`);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    },
};

// Zones API
export const zonesAPI = {
    getAll: async (params?: { city?: string; type?: string; limit?: number }) => {
        const response = await api.get('/zones', { params });
        return response.data;
    },

    getNearby: async (latitude: number, longitude: number, radius?: number) => {
        const response = await api.get('/zones/nearby', {
            params: { latitude, longitude, radius },
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/zones/${id}`);
        return response.data;
    },

    create: async (data: {
        name: string;
        type: string;
        latitude: number;
        longitude: number;
        avg_decibels?: number;
        description?: string;
        amenities?: string[];
        best_time?: string;
    }) => {
        const response = await api.post('/zones', data);
        return response.data;
    },

    rate: async (id: string, rating: number, comment?: string) => {
        const response = await api.post(`/zones/${id}/rate`, { rating, comment });
        return response.data;
    },
};

// Analytics API
export const analyticsAPI = {
    getHourly: async () => {
        const response = await api.get('/analytics/hourly');
        return response.data;
    },

    getWeekly: async () => {
        const response = await api.get('/analytics/weekly');
        return response.data;
    },

    getSources: async () => {
        const response = await api.get('/analytics/sources');
        return response.data;
    },

    getHotspots: async () => {
        const response = await api.get('/analytics/hotspots');
        return response.data;
    },

    getCityStats: async () => {
        const response = await api.get('/analytics/city-stats');
        return response.data;
    },
};

// WebSocket connection
export class NoiseWebSocket {
    private ws: WebSocket | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private listeners: ((data: any) => void)[] = [];

    connect() {
        const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.listeners.forEach((listener) => listener(data));
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('❌ WebSocket disconnected');
            // Reconnect after 5 seconds
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
        };
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    onMessage(callback: (data: any) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== callback);
        };
    }

    send(data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}

export default api;
