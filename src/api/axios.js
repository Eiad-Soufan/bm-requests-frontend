// src/api/axios.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // ✏️ عدله إذا كنت تستخدم رابط آخر

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor لإضافة Authorization header تلقائيًا
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor للردود: إذا انتهت صلاحية التوكن، يسجل خروج المستخدم
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔐 حذف التوكن وجميع البيانات
      localStorage.clear();
      // ⛔️ إعادة التوجيه لصفحة تسجيل الدخول
      window.location.href = '/'; // ✏️ غيّر المسار إن كنت تستخدم صفحة تسجيل دخول أخرى
    }
    return Promise.reject(error);
  }
);

export default instance;
