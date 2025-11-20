const API_BASE_URL = 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  quantity: number;
  rating: number;
  numReviews: number;
  seller: {
    _id: string;
    name: string;
    email: string;
    rating: number;
  };
  location?: {
    city: string;
    state: string;
  };
  sdgGoals?: number[];
}

interface Order {
  _id: string;
  buyer: string;
  seller: string;
  product: string | Product;
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    apiRequest('/auth/me', { token }),
};

export const productAPI = {
  getAll: (params?: Record<string, string>): Promise<Product[]> => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/products${queryString}`);
  },

  getById: (id: string): Promise<Product> =>
    apiRequest(`/products/${id}`),

  create: (data: Partial<Product>, token: string): Promise<Product> =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: Partial<Product>, token: string): Promise<Product> =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string): Promise<{ message: string }> =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export const orderAPI = {
  create: (data: {
    productId: string;
    quantity: number;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
  }, token: string): Promise<Order> =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getMyOrders: (token: string): Promise<Order[]> =>
    apiRequest('/orders/my-orders', { token }),

  getMySales: (token: string): Promise<Order[]> =>
    apiRequest('/orders/my-sales', { token }),

  getById: (id: string, token: string): Promise<Order> =>
    apiRequest(`/orders/${id}`, { token }),

  updateStatus: (id: string, status: string, token: string): Promise<Order> =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: status }),
      token,
    }),
};

export const userAPI = {
  getProfile: (token: string): Promise<User> =>
    apiRequest('/users/profile', { token }),

  updateProfile: (data: Partial<User>, token: string): Promise<User> =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  getById: (id: string): Promise<User> =>
    apiRequest(`/users/${id}`),
};