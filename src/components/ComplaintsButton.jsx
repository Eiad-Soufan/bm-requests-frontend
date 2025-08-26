import React, { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ComplaintsButton({ showLabel = true }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const role = localStorage.getItem('userRole'); // 'employee' | 'manager' | 'hr'
  const token = localStorage.getItem('access');
  const mounted = useRef(true);

  const fetchUnreadCount = async (signal?: AbortSignal) => {
    if (!role || !token) return;

    let endpoint = '';
    if (role === 'employee') endpoint = '/api/complaints/my_complaints/';
    else if (role === 'manager') endpoint = '/api/complaints/manager_complaints/';
    else if (role === 'hr') endpoint = '/api/complaints/hr_complaints/';
    if (!endpoint) return;

    try {
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        // axios v1+ يدعم AbortController عبر signal (يتجاهله إن لم يُدعم)
        signal,
      });

      const list = Array.isArray(res?.data) ? res.data : [];

      const count =
        role === 'employee'
          ? list.filter(c => c?.is_responded && !c?.is_seen_by_employee).length
          : list.filter(c => !c?.is_seen_by_recipient).length;

      if (mounted.current) setUnreadCount(count);
    } catch {
      // صامت: نبقي الرقم السابق ولا نكسر الواجهة
    }
  };

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();

    fetchUnreadCount(controller.signal);

    // تحديث دوري خفيف؛ غيّره لـ 10000ms إذا رغبت
    const id = setInterval(() => fetchUnreadCount(controller.signal), 15000);

    const onFocus = () => fetchUnreadCount(controller.signal);
    const onVis = () => { if (!document.hidden) fetchUnreadCount(controller.signal); };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      mounted.current = false;
      controller.abort();
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [role, token]); // إعادة الاشتغال إن تغيّر الدور أو التوكن

  const label = t('complaints') || 'Complaints';
  const size = 'clamp(44px, 9vw, 56px)';         // زر متجاوب
  const iconSize = 'clamp(18px, 5.5vw, 24px)';   // حجم أيقونة متجاوب
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="d-inline-flex flex-column align-items-center" style={{ minWidth: 64 }}>
      <button
        type="button"
        className="btn btn-light position-relative d-flex align-items-center justify-content-center shadow-sm"
        onClick={() => navigate('/complaints')}
        aria-label={label}
        title={label}
        style={{
          width: size,
          height: size,
          padding: 0,
          borderRadius: 12,
          overflow: 'visible',  // كي لا تُقصّ الشارة
          lineHeight: 1,
        }}
      >
        {/* أيقونة فقاعة كلام */}
        <span aria-hidden="true" style={{ fontSize: iconSize }}>💬</span>

        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{
              minWidth: 20,
              height: 20,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
              fontSize: 12,
              lineHeight: 1,
              boxShadow: '0 0 0 2px #fff', // حد أبيض يبرز الشارة فوق الخلفيات
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {displayCount}
          </span>
        )}
      </button>

      {showLabel && (
        <small
          className="mt-1 text-white"
          style={{ opacity: 0.95, fontWeight: 600, fontSize: 'clamp(10px, 2.8vw, 12px)' }}
        >
          {label}
        </small>
      )}

      {/* منطقة حيّة لقرّاء الشاشة تعلن التغيير */}
      <span className="visually-hidden" aria-live="polite">
        {unreadCount > 0 ? `${displayCount} ${label} unread` : `No unread ${label}`}
      </span>
    </div>
  );
}
