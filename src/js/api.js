
import axios from "axios";
//  const BASE_URL = "https://localhost:7031/api/";
const BASE_URL = "https://api.int-mgm.org/api/";
function getAuthToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api; 
