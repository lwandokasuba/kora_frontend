import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SuccessResponse } from '@/types';

// Use NEXT_PUBLIC_ prefix for client-side environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Generic CRUD methods
    // We update these to return Promise<T> but generally T will now be SuccessResponse<Data>

    async get<T>(endpoint: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(endpoint);
        return response.data;
    }

    async getById<T>(endpoint: string, id: number | string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(`${endpoint}/${id}`);
        return response.data;
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(endpoint, data);
        return response.data;
    }

    async put<T>(endpoint: string, id: number | string, data: unknown): Promise<T> {
        // Handle cases where id might be part of the URL or just data
        const url = id ? `${endpoint}/${id}` : endpoint;
        const response: AxiosResponse<T> = await this.client.put(url, data);
        return response.data;
    }

    async patch<T>(endpoint: string, id: number | string, data: unknown): Promise<T> {
        const url = id ? `${endpoint}/${id}` : endpoint;
        const response: AxiosResponse<T> = await this.client.patch(url, data);
        return response.data;
    }

    async delete<T>(endpoint: string, id: number | string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(`${endpoint}/${id}`);
        return response.data;
    }
}

import { mockApiClient } from './factory';

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Export the appropriate client based on environment or create a new real client
export const apiClient = USE_MOCK_API ? mockApiClient : new ApiClient();
