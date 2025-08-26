// src/components/NotificationButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('access');

  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/user-notifications/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch {/* silent */}
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    const onFocus = () => fetchNotifications();
    const onVis = () => { if (!document.hidden) fetchNotifications(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []); // eslint-disable-line

  // إعادة تحميل عند تغيير اللغة (اختياري للتواريخ)
  useEffect(() => {
    const handler = () => fetchNotifications();
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []); // eslint-disable-line

  // إغلاق اللوحة عند النقر خارجها
  useEffect(() => {
    if (!showPanel) return;
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setShowPanel(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [showPanel]);

  // نضمن وجود --header-h (في حال لم يحقنها Header.jsx)
  useEffect(() => {
    const ensureHeaderVar = () => {
      const current = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
      if (!current) {
        const h = document.querySelector('.bm-header')?.offsetHeight || 56;
        document.documentElement.style.setProperty('--header-h', `${h}px`);
      }
    };
    ensureHeaderVar();
    window.addEventListener('resize', ensureHeaderVar);
    return () => window.removeEventListener('resize', ensureHeaderVar);
  }, []);

  // نكتشف الجوال ديناميكيًا
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 576px)').matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 576px)');
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (userNotifId) => {
    try {
      await axios.post(`/api/user-notifications/${userNotifId}/mark_as_read/`, {});
      setNotifications(prev =>
        prev.map(n => (n.id === userNotifId ? { ...n, is_read: true } : n))
      );
    } catch { /* silent */ }
  };

  const openDetails = async (item) => {
    setSelected(item);
    setShowModal(true);
    if (!item.is_read) await markAsRead(item.id);
  };

  const importanceBadge = (importance) => {
    const isUrgent = importance === 'important';
    const label = isUrgent ? (t('urgent') || t('important') || 'Urgent')
                           : (t('normal') || 'Normal');
    const cls = `badge rounded-pill ${isUrgent ? 'bg-danger' : 'bg-secondary'}`;
    return <span className={cls}>{label}</span>;
  };

  const fmtDate = (iso, lang = i18n.language || 'en') => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      if (lang.startsWith('ar')) {
        const df = new Intl.DateTimeFormat('ar-EG', {
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true,
        });
        const parts = df.formatToParts(d);
        const get = (t) => (parts.find(p => p.type === t)?.value || '');
        return `${get('day')} ${get('month')} ${get('year')}، ${get('hour')}:${get('minute')} ${get('dayPeriod')}`;
      }
      return new Intl.DateTimeFormat(undefined, {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }).format(d);
    } catch { return ''; }
  };

  // أنماط اللوحة: ثابتة على الجوال، مطلقة على الديسكتوب
  const panelStyle = isMobile
    ? {
        position: 'fixed',
        top: 'calc(var(--header-h, 56px) + 8px)',
        left: 12,
        right: 12,
        width: 'auto',
        maxHeight: 'calc(100dvh - var(--header-h, 56px) - 24px)',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        zIndex: 2000,
        animation: 'fadeIn 0.18s ease-out',
        margin: 0,
      }
    : {
        position: 'absolute',
        top: 56,
        right: 0,
        width: 340,
        maxHeight: 'min(70vh, 580px)',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        zIndex: 2000,
        animation: 'fadeIn 0.18s ease-out',
      };

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="d-flex flex-column align-items-center position-relative" style={{ minWidth: 64 }}>
      {/* الزر */}
      <button
        ref={btnRef}
        className="btn btn-light position-relative d-flex align-items-center justify-content-center shadow-sm"
        onClick={() => setShowPanel(prev => !prev)}
        aria-label={t('notifications') || 'Notifications'}
        title={t('notifications') || 'Notifications'}
        style={{ width: 44, height: 44, padding: 0, borderRadius: 12 }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {displayCount}
          </span>
        )}
      </button>

      {/* التسمية */}
      <small className="mt-1 text-white" style={{ opacity: 0.95, fontWeight: 600 }}>
        {t('notifications') || 'Notifications'}
      </small>

      {/* اللوحة المنسدلة */}
      {showPanel && (
        <div ref={panelRef} className="notif-panel" style={panelStyle}>
          <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
            <strong style={{ fontSize: '0.95rem' }}>
              {t('notifications') || 'Notifications'}
            </strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowPanel(false)}>
              {t('close') || 'Close'}
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-3 text-muted">{t('no_notifications') || 'No notifications.'}</div>
          ) : (
            <div style={{ maxHeight: isMobile ? 'unset' : 580 }}>
              <ul className="list-group list-group-flush">
                {notifications.map((n) => {
                  const notif = n?.notification || {};
                  const title = notif.title || (t('notification') || 'Notification');
                  return (
                    <li
                      key={n.id}
                      className="list-group-item d-flex align-items-center justify-content-between"
                      role="button"
                      onClick={() => openDetails(n)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="text-truncate" style={{ maxWidth: 230, fontWeight: 600 }}>
                        {title}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {importanceBadge(notif.importance)}
                        {!n.is_read && (
                          <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>
                            {t('new') || 'New'}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* نافذة التفاصيل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            {importanceBadge(selected?.notification?.importance)}
            <span className="text-truncate">
              {selected?.notification?.title || (t('notification') || 'Notification')}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-muted small mb-2">
            {selected?.notification?.created_at ? fmtDate(selected.notification.created_at) : null}
          </div>
          <div
            style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, wordBreak: 'break-word' }}
            dir={i18n.language?.startsWith('ar') ? 'rtl' : 'ltr'}
          >
            {selected?.notification?.message || ''}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('close') || 'Close'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
};

export default NotificationButton;
