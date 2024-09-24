import axios from "axios";

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // This enables sending cookies with requests
});
