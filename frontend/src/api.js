// src/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5226/api";
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5226";
export const PAGES_URL = import.meta.env.VITE_PAGES_URL || "http://localhost:3000";
//phải lên vercel vào project vào Environment Variables thêm VITE_API_URL = https://backend-sneakerstore.onrender.com/api và
//  thêm VITE_BASE_URL = https://backend-sneakerstore.onrender.com để chạy trên vercel nhé, nếu không sẽ bị lỗi CORS khi gọi API từ frontend trên vercel đến backend trên render.