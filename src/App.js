import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import PrintView from './pages/PrintView';
import AdminRoute from './utils/AdminRoute';
import AdminNotify from './pages/AdminNotify';
import Complaints from './pages/Complaints';
import 'bootstrap/dist/css/bootstrap.min.css';
import SubmitComplaint from './pages/SubmitComplaint';
import Policies from './pages/Policies';


function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/" element={<Login />} />
        <Route path="/print" element={<PrintView />} />

        {/* 🔒 صفحة الإشعارات الخاصة بالإدارة */}
        <Route
          path="/admin-notify"
          element={
            <AdminRoute>
              <AdminNotify />
            </AdminRoute>
          }
        />

        {/* 🔒 لوحة التحكم - محمية */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

<Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />

<Route path="/submit-complaint" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
<Route path="/policies" element={<Policies />} />
        {/* إعادة توجيه لأي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
