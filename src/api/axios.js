// src/api/axios.js
import axios from "axios";

/**
 * نقرأ عنوان الـ API من متغيّر بيئة CRA:
 * في نتليفاي سنضبط REACT_APP_API_BASE = https://bm-requests-backend.onrender.com
 * محليًا، يبقى السقوط الافتراضي على 127.0.0.1:8000
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE?.trim() || "http://127.0.0.1:8000";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // لو كنت تستخدم كوكيز مع الـ CSRF استعمل التالي:
  // withCredentials: true,
});

// ✅ Interceptor لإضافة Authorization header تلقائيًا (JWT من localStorage)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor للردود: عند 401 نحذف التوكن ونعيد إلى صفحة الدخول
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/"; // عدّل المسار إن كانت صفحة الدخول مختلفة
    }
    return Promise.reject(error);
  }
);

export default instance;
