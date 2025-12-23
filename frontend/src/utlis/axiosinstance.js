import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5555", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
// interceptor is a middleware that runs before any req it attach token to req auto 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // set token in https req header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
