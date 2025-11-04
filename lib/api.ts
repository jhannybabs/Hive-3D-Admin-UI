import axios from "axios";

const api = axios.create({
  baseURL: "http://10.34.126.49:2701", // backend NestJS URL mo
  withCredentials: true,
});

export default api;
