import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 🔧 API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// 🔧 Extended Axios Config with metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// 🌐 Create API client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 📤 Request Interceptor
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('🔴 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 📥 Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate response time
    const endTime = new Date();
    const config = response.config as ExtendedAxiosRequestConfig;
    const startTime = config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`🟢 API Response [${response.config.method?.toUpperCase()}] ${response.config.url} - ${duration}ms`);
    }

    return response;
  },
  (error: AxiosError<any>) => {
    // Enhanced error handling
    if (!error.response) {
      // Network error
      const serverMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      console.error('🔴 Network Error:', serverMessage);
      
      if (typeof window !== 'undefined') {
        // Show global error notification (you can customize this)
        console.error('Server connection failed');
      }
      
      return Promise.reject(new Error(serverMessage));
    }

    // HTTP error responses
    const { status, data } = error.response;
    let errorMessage = 'Ha ocurrido un error inesperado';

    switch (status) {
      case 401:
        errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Redirect to login or trigger logout
          window.location.href = '/auth/signin';
        }
        break;
      
      case 403:
        errorMessage = 'No tienes permisos para realizar esta acción.';
        break;
      
      case 404:
        errorMessage = 'El recurso solicitado no fue encontrado.';
        break;
      
      case 422:
        errorMessage = (data as any)?.message || 'Datos inválidos. Verifica la información ingresada.';
        break;
      
      case 429:
        errorMessage = 'Demasiadas solicitudes. Intenta nuevamente en unos momentos.';
        break;
      
      case 500:
        errorMessage = 'Error interno del servidor. Nuestro equipo ha sido notificado.';
        break;
      
      case 503:
        errorMessage = 'Servicio temporalmente no disponible. Intenta nuevamente más tarde.';
        break;
      
      default:
        errorMessage = (data as any)?.message || `Error ${status}: ${error.message}`;
    }

    console.error(`🔴 API Error [${status}]:`, errorMessage);
    
    return Promise.reject({
      status,
      message: errorMessage,
      originalError: error,
      data: data,
    });
  }
);

// 🔌 Connection Health Check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('🔴 API Health Check Failed:', error);
    return false;
  }
};

// 🚀 Enhanced API Methods
export const api = {
  // GET Request
  get: async <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST Request
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT Request
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH Request
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE Request
  delete: async <T = any>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // File Upload
  upload: async <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// 🔄 Retry mechanism for critical requests
export const apiWithRetry = {
  get: async <T = any>(url: string, params?: Record<string, any>, maxRetries = 3): Promise<T> => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await api.get<T>(url, params);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) break;
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`🔄 Retrying request in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },
};

// 📊 API Configuration Info
export const getApiConfig = () => ({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  isProduction: process.env.NODE_ENV === 'production',
});

export default api;