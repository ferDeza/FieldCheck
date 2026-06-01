
// Configuración dinámica para Vite
// En Vercel configurarás la variable de entorno como VITE_API_URL
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8081/api';

// Función auxiliar para obtener las cabeceras con el token JWT de forma automática
const getHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Recuperamos el token que guardas en el navegador al hacer login
  const token = localStorage.getItem('token'); 
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
};

export default apiClient;