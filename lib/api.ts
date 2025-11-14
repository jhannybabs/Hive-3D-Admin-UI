import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.254.106:2701",
  withCredentials: true,
});

export default api;
