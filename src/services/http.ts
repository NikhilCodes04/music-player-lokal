const BASE_URL = 'https://saavn.sumit.co/api';

interface RequestConfig {
  params?: Record<string, string | number>;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // API wraps data in a 'data' field with success boolean
  if (data.success === false) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data as T;
}

export const http = {
  get: request,
};
