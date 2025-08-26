// src/components/Header.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NotificationButton from './NotificationButton';
import ComplaintsButton from './ComplaintsButton';
import logo2 from '../assets/logo2.png';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // بيانات المستخدم
  const username = localStorage.getItem('username') || t('guest', { defaultValue: 'Guest' });
  const userId   = localStorage.getItem('userId')  || localStorage.getItem('id') || '';
  const roleCode = (localStorage.getItem('userRole') || '').toLowerCase(); // manager | hr | employee

  const roleLabel = (code) => {
    switch (code) {
      case 'manager':  return t('role.manager',  { defaultValue: 'Manager' });
      case 'hr':       return t('role.hr',       { defaultValue: 'HR' });
      case 'employee': return t('role.employee', { defaultValue: 'Employee' });
      default:         return '';
    }
  };

  const systemTitle    = t('system_title',    { defaultValue: 'Berkat Madinah Portal' });
  const systemSubtitle = t('system_subtitle', { defaultValue: 'Internal portal for forms, approvals & communications' });

  // إعادة التصيير عند تغيير اللغة
  const [, force] = useState(0);
  useEffect(() => {
    const handler = () => force(v => v + 1);
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [i18n]);

  useEffect(() => { document.title = systemTitle || 'Portal'; }, [systemTitle, i18n.language]);

  // زجاجي عند التمرير
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      headerRef.current.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lang = i18n.language || 'en';
  const isAR = lang.startsWith('ar');
  const setLang = (code) => i18n.changeLanguage(code);

  // ✅ تسجيل الخروج
  const handleLogout = () => {
    const keysToRemove = [
      'access','refresh','token','access_token','refresh_token',
      'username','userRole','userId','id'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    try { sessionStorage.clear(); } catch {}
    navigate('/login');
  };

  return (
    <>
      <header className="bm-header" ref={headerRef}>
        <div className="bm-container">
          {/* ===== Brand ===== */}
          <div className="bm-brand" onClick={() => navigate('/dashboard')} role="button" title={systemTitle}>
            <div className="bm-logo-wrap">
              <img src={logo2} alt="logo" className="bm-logo-img" />
            </div>
            <div className="bm-brand-text">
              <Link to="/dashboard" className="bm-brand-title" onClick={(e) => e.stopPropagation()}>
                {systemTitle}
              </Link>
              <div className="bm-brand-tagline">{systemSubtitle}</div>
            </div>
          </div>

          {/* ===== Actions ===== */}
          <div className="bm-actions">
            <ComplaintsButton />
            <NotificationButton />

            {/* Lang switch: AR | EN */}
            <div className="bm-lang" aria-label="Language switch">
              <button
                className={`bm-langbtn ${isAR ? 'active' : ''}`}
                onClick={() => setLang('ar')}
                title="العربية"
              >
                AR
              </button>
              <span className="bm-langsep">|</span>
              <button
                className={`bm-langbtn ${!isAR ? 'active' : ''}`}
                onClick={() => setLang('en')}
                title="English"
              >
                EN
              </button>
            </div>

            {/* User chip */}
            <div className="bm-userchip" title={username}>
              <div className="bm-avatar" aria-hidden>
                {String(username).trim().charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="bm-userinfo">
                <div className="bm-username text-truncate">{username}</div>
                {(roleCode || userId) && (
                  <div className="bm-userextra text-truncate">
                    {roleLabel(roleCode)}
                    {roleCode && userId ? ' · ' : ''}
                    {userId ? `${t('id', { defaultValue: 'ID' })}: ${userId}` : ''}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ زر تسجيل الخروج بأقصى اليمين */}
            <button className="bm-logout" onClick={handleLogout} title={t('logout', { defaultValue: 'Logout' })}>
              <span className="bm-logout-icon" aria-hidden>⎋</span>
              <span className="bm-logout-text">{t('logout', { defaultValue: 'Logout' })}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Styles ===== */}
      <style>{`
        :root{
          --bm-radius:12px;
          --bm-green-1:#10c48b;   /* نفس درجات الهيدر */
          --bm-green-2:#0ea36b;
          --bm-green-3:#0a6f47;
          --bm-sheen:rgba(255,255,255,0.14);
          --bm-white:#ffffff;
          --bm-shadow:0 10px 24px rgba(0,0,0,.14);
        }

        .bm-header{
          direction:ltr;
          position:sticky; top:0; z-index:1030; color:var(--bm-white);
          --bm-alpha:.88;
          background:
            radial-gradient(1100px 170px at 18% -40%, var(--bm-sheen), transparent 60%),
            linear-gradient(135deg,
              rgba(16,196,139,var(--bm-alpha)) 0%,
              rgba(14,163,107,var(--bm-alpha)) 52%,
              rgba(10,111,71,var(--bm-alpha)) 100%
            );
          backdrop-filter: saturate(140%) blur(8px);
          -webkit-backdrop-filter: saturate(140%) blur(8px);
          box-shadow: var(--bm-shadow);
          transition: backdrop-filter .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .bm-header.is-scrolled{ --bm-alpha:.72; box-shadow:0 12px 30px rgba(0,0,0,.18); }

        .bm-container{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 18px; }

        /* Brand */
        .bm-brand{ display:flex; align-items:center; gap:12px; min-width:0; }
        .bm-logo-wrap{
          width:48px; height:48px; border-radius:var(--bm-radius);
          background: rgba(255,255,255,.12);
          display:grid; place-items:center;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
          transition: transform .16s ease, background .16s ease, box-shadow .16s ease;
          padding:0; overflow:hidden;
        }
        .bm-logo-img{ width:100%; height:100%; object-fit:contain; display:block; }
        .bm-brand:hover .bm-logo-wrap{
          transform: translateY(-1px);
          background: rgba(255,255,255,.18);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
        }
        .bm-brand-text{ display:flex; flex-direction:column; min-width:0; }
        .bm-brand-title{
          color:#fff; text-decoration:none; font-weight:800; font-size:1.18rem; line-height:1.05;
          text-shadow: 0 1px 0 rgba(0,0,0,.08);
          transition: opacity .12s ease, text-shadow .2s ease;
        }
        .bm-brand-title:hover{ opacity:.95; text-shadow: 0 2px 10px rgba(0,0,0,.16); }
        .bm-brand-tagline{ opacity:.96; font-size:.9rem; line-height:1.2; }

        /* Actions */
        .bm-actions{ display:flex; align-items:center; gap:12px; }

        /* Lang switch */
        .bm-lang{ display:flex; align-items:center; gap:8px; background: rgba(255,255,255,.14); border-radius: var(--bm-radius); padding: 4px 8px; }
        .bm-langbtn{
          border:none; outline:none; background:transparent; color:#fff; font-weight:800; letter-spacing:.5px; padding:4px 8px;
          border-radius:8px; transition: background .15s ease, transform .12s ease;
        }
        .bm-langbtn:hover{ background: rgba(255,255,255,.16); transform: translateY(-1px); }
        .bm-langbtn.active{ background: rgba(255,255,255,.28); }
        .bm-langsep{ color: rgba(255,255,255,.55); font-weight:700; }

        /* User chip */
        .bm-userchip{
          background: rgba(255,255,255,.14); color:#fff;
          border-radius: var(--bm-radius);
          padding: 6px 10px;
          display:inline-flex; align-items:center; gap:10px; max-width:260px;
        }
        .bm-avatar{ width:28px; height:28px; border-radius:50%; background: rgba(255,255,255,.22); display:grid; place-items:center; font-weight:800; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
        .bm-userinfo{ display:flex; flex-direction:column; min-width:0; }
        .bm-username{ max-width:180px; font-weight:700; line-height:1.1; }
        .bm-userextra{ max-width:180px; font-size:.78rem; opacity:.92; }

        /* ✅ زر تسجيل الخروج */
        .bm-logout{
          display:inline-flex; align-items:center; gap:8px;
          background: rgba(255,255,255,.14);
          color:#fff; border:none; border-radius: var(--bm-radius);
          padding:8px 12px; font-weight:900; letter-spacing:.2px; cursor:pointer;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
          transition: background .15s ease, transform .12s ease, box-shadow .12s ease;
        }
        .bm-logout:hover{
          background: rgba(255,255,255,.20); transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,.14), inset 0 0 0 1px rgba(255,255,255,.22);
        }
        .bm-logout-icon{ font-size:16px; line-height:1; }

        /* Responsive */
        @media (max-width: 992px){ .bm-brand-tagline{ display:none; } }
        @media (max-width: 576px){
          .bm-userextra{ display:none; }
          .bm-logo-wrap{ width:44px; height:44px; }
          .bm-logout-text{ display:none; } /* نحافظ على المساحة على الشاشات الصغيرة */
        }
      `}</style>
    </>
  );
}
