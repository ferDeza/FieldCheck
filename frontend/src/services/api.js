const normalizeApiBaseUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_URL) || `${window.location.origin}/api`;

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

    getMyBookings: async () => {
  const response = await fetch(
    `${API_BASE_URL}/v1/booking/my-bookings`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return await response.json();
},
};

/**
 * Sport Field Service
 */
export const sportFieldService = {
  getAllSportFields: async (district, type) => {
    let url = `${API_BASE_URL}/fields`;
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (type) params.append('type', type);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
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

/**
 * Schedule Service
 */
export const scheduleService = {
  getSchedulesByField: async (fieldId) => {
    const response = await fetch(`${API_BASE_URL}/schedules/field/${fieldId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }

    return await response.json();
  },

  createSchedule: async (scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create schedule');
    }

    return await response.json();
  },
};

/**
 * Admin Service
 */
export const adminService = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin dashboard');
    }

    return await response.json();
  },

  getBookingsForToday: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings-today`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today bookings');
    }

    return await response.json();
  },

  getRevenueHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/revenue-history`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch revenue history');
    }

    return await response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
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

/**
 * Payment Service (frontend stubs)
 */
export const paymentService = {
  createPayment: async (bookingId, payerId, amount, method) => {
    const response = await fetch(`${API_BASE_URL}/v1/payments?bookingId=${bookingId}&payerId=${payerId}&amount=${amount}&method=${encodeURIComponent(method)}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create payment');
    }
    return await response.json();
  },


  confirmPayment: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/v1/payments/${paymentId}/confirm`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to confirm payment');
    }
    return await response.json();
  },
};


