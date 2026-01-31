import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const serverMessage = 'No se puede conectar con el servidor. Por favor intenta nuevamente más tarde.';
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('SERVER_DOWN', {
          detail: { message: serverMessage }
        });
        window.dispatchEvent(event);
      }
      // Marcar como manejado globalmente
      error.handledGlobally = true;
      return Promise.reject(error);
    }

    // Manejo específico de 5xx (error del servidor)
    if (error.response && error.response.status >= 500) {
      const serverMessage = error.response.data?.msg || 'El servidor está en mantenimiento. Intenta más tarde.';
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('SERVER_DOWN', {
          detail: { message: serverMessage }
        });
        window.dispatchEvent(event);
      }
      error.handledGlobally = true;
      return Promise.reject(error);
    }

    // Manejo de sesión expirada (401)
    if (error.response && error.response.status === 401) {
      const serverMessage = error.response.data?.msg || "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('SESSION_EXPIRED', {
          detail: { message: serverMessage }
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);

export const get = async <T>(url: string): Promise<T | undefined> => {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error: any) {
    if (error.handledGlobally) {
      // El error ya fue manejado globalmente (SERVER_DOWN mostrado)
      // Retornar undefined para evitar unhandledrejection
      return undefined;
    }
    return Promise.reject(error);
  }
};

export const post = async <T, B>(url: string, data: B): Promise<T | undefined> => {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.handledGlobally) {
      // El error ya fue manejado globalmente (SERVER_DOWN mostrado)
      // Retornar undefined para evitar unhandledrejection
      return undefined;
    }
    return Promise.reject(error);
  }
};

// POST con autenticación (usa el interceptor automáticamente)
export const postWithAuth = async <T, B>(url: string, data: B): Promise<T | undefined> => {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.handledGlobally) {
      return undefined;
    }
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const put = async <T, B>(url: string, data: B): Promise<T | undefined> => {
  try {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.handledGlobally) {
      return undefined;
    }
    return Promise.reject(error);
  }
};

export const del = async <T>(url: string): Promise<T | undefined> => {
  try {
    const response = await apiClient.delete<T>(url);
    return response.data;
  } catch (error: any) {
    if (error.handledGlobally) {
      return undefined;
    }
    return Promise.reject(error);
  }
};
