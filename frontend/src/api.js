import axios from "axios";

// Canlıya alırken REACT_APP_API_URL ortam değişkeniyle backend adresini verin
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  timeout: 10000,
});

export default api;
