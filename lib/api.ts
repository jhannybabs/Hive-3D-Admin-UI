import axios from "axios";

const api = axios.create({
  baseURL: "http://3.107.22.251:2701",
  withCredentials: true,
});

export default api;
