import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-url.com",
  timeout: 5000,
});

export default api;
