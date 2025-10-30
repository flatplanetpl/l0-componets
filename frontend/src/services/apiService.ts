// frontend/src/services/apiService.ts

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    const config: RequestInit = {
      headers: defaultHeaders,
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Generic methods for common CRUD operations
  async list<T>(resource: string, params?: Record<string, any>): Promise<ListResponse<T>> {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    const endpoint = queryParams ? `${resource}?${queryParams}` : resource;
    return this.get<ListResponse<T>>(endpoint);
  }

  async getOne<T>(resource: string, id: string | number): Promise<T> {
    return this.get<T>(`${resource}/${id}`);
  }

  async create<T>(resource: string, data: Partial<T>): Promise<T> {
    return this.post<T>(resource, data);
  }

  async update<T>(resource: string, id: string | number, data: Partial<T>): Promise<T> {
    return this.put<T>(`${resource}/${id}`, data);
  }

  async remove<T>(resource: string, id: string | number): Promise<T> {
    return this.delete<T>(`${resource}/${id}`);
  }
}

export default ApiService;