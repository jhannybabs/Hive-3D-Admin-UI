import axios from "axios";

// Use relative URLs for HTTPS compatibility (no mixed content issues)
// API routes will proxy to the backend server-side
const api = axios.create({
  baseURL: "", // Use relative URLs - will go through Next.js API routes
  withCredentials: true,
});

export default api;
