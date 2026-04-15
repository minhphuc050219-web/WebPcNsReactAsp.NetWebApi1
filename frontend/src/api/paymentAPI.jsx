import axios from "axios";
import { BASE_URL } from "./index"; // Lấy link gốc từ file index.js

// Hàm gọi API tạo link VNPAY
export const createPaymentUrl = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/Payment/create-payment-url`, orderData);
    return response.data; 
  } catch (error) {
    console.error("Lỗi tạo link thanh toán VNPAY:", error);
    throw error;
  }
};