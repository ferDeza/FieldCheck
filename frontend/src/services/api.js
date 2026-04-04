const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Auth Service
 */
export const authService = {
  register: async (firstName, lastName, email, password, phone) => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },
};

/**
 * Booking Service
 */
export const bookingService = {
  getAllBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/v1/booking`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  },

  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/v1/booking`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return await response.json();
  },

  deleteBooking: async (id) => {
    const response = await fetch(`${API_BASE_URL}/v1/booking/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
  },
};

/**
 * Sport Field Service
 */
export const sportFieldService = {
  getAllSportFields: async () => {
    const response = await fetch(`${API_BASE_URL}/fields`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sport fields');
    }

    return await response.json();
  },

  createSportField: async (fieldData) => {
    const response = await fetch(`${API_BASE_URL}/fields`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create sport field');
    }

    return await response.json();
  },
};
