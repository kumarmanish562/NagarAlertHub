import axios from "axios";

// Connection Status: USING TUNNEL (Bypassing Firewall)
export const BASE_URL = "https://eleven-drinks-count.loca.lt/api/v1";

// WebSocket URL
export const WS_BASE_URL = "wss://eleven-drinks-count.loca.lt/api/v1/ws";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "bypass-tunnel-reminder": "true",
  }
});

api.interceptors.request.use(request => {
  console.log('Using URL:', request.baseURL + request.url);
  return request;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
};

export const updateUserLocation = async (userId, lat, lng) => {
  await api.post("/users/update-location", {
    user_id: userId, latitude: lat, longitude: lng
  });
};

export const submitReport = async (formData) => {
  const response = await api.post("/reports/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

export const getReports = async () => {
  const response = await api.get("/reports/");
  return response.data;
};

export default api;