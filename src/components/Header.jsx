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

  // دعم الكيبورد للعنصر القابل للنقر
  const onBrandKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/dashboard');
    }
  };

  return (
    <>
      <header className="bm-header" ref={headerRef}>
        <div className="bm-container">
          {/* ===== Brand ===== */}
          <div
            className="bm-brand"
            onClick={() => navigate('/dashboard')}
            onKeyDown={onBrandKeyDown}
            role="button"
            tabIndex={0}
            title={systemTitle}
          >
            <div className="bm-logo-wrap">
              <img src={logo2} alt="logo" className="bm-logo-img" />
            </div>
            <div className="bm-brand-text">
              <Link
                to="/dashboard"
                className="bm-brand-title"
                onClick={(e) => e.stopPropagation()}
                title={systemTitle}
              >
                {systemTitle}
              </Link>
              <div className="bm-brand-tagline">{systemSubtitle}</div>
            </div>
          </div>

          {/* ===== Actions ===== */}
          <div className="bm-actions" aria-label="Header actions">
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
              <span className="bm-langsep" aria-hidden>|</span>
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
          --bm-green-1:#10c48b;
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

        /* الحاوية تلتف تلقائيًا، ومع الجوال نصبح صفّين (Brand فوق، Actions تحت) */
        .bm-container{
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; row-gap:8px; flex-wrap:wrap;
          padding-block: 12px;
          padding-inline: max(12px, calc(env(safe-area-inset-left) + 12px))
                          max(12px, calc(env(safe-area-inset-right) + 12px));
        }

        /* Brand */
        .bm-brand{
          display:flex; align-items:center; gap:12px; min-width:0;
          flex: 1 1 auto;
          cursor: pointer;
        }
        .bm-logo-wrap{
          width:48px; height:48px; border-radius:var(--bm-radius);
          background: rgba(255,255,255,.12);
          display:grid; place-items:center;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
          transition: transform .16s ease, background .16s ease, box-shadow .16s ease;
          padding:0; overflow:hidden; flex:0 0 auto;
        }
        .bm-logo-img{ width:100%; height:100%; object-fit:contain; display:block; }
        .bm-brand:hover .bm-logo-wrap{
          transform: translateY(-1px);
          background: rgba(255,255,255,.18);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
        }
        .bm-brand-text{ display:flex; flex-direction:column; min-width:0; }
        .bm-brand-title{
          color:#fff; text-decoration:none; font-weight:800;
          font-size:clamp(1rem, 2.2vw, 1.18rem); line-height:1.15;
          text-shadow: 0 1px 0 rgba(0,0,0,.08);
          transition: opacity .12s ease, text-shadow .2s ease;
          /* على الديسكتوب قصّ خفيف لتجنّب التداخل */
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          max-width: clamp(160px, 36vw, 640px);
          display:inline-block;
        }
        .bm-brand-title:hover{ opacity:.95; text-shadow: 0 2px 10px rgba(0,0,0,.16); }
        .bm-brand-tagline{
          opacity:.96; font-size:.9rem; line-height:1.25;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          max-width: clamp(180px, 38vw, 680px);
        }

        /* Actions */
        .bm-actions{
          display:flex; align-items:center; gap:12px; flex-wrap:wrap;
          justify-content:flex-end;
          flex: 0 1 auto;
          min-width: 0;
        }

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
          display:inline-flex; align-items:center; gap:10px;
          max-width: clamp(160px, 28vw, 260px);
          min-width: 0;
        }
        .bm-avatar{ width:28px; height:28px; border-radius:50%; background: rgba(255,255,255,.22); display:grid; place-items:center; font-weight:800; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); flex:0 0 auto; }
        .bm-userinfo{ display:flex; flex-direction:column; min-width:0; }
        .bm-username{ max-width:100%; font-weight:700; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .bm-userextra{ max-width:100%; font-size:.78rem; opacity:.92; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

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

        /* ===== نقاط توقف ===== */
        /* عند الشاشات الصغيرة: Brand يأخذ صف كامل، والنص يلتف ويظهر بالكامل */
        @media (max-width: 576px){
          .bm-brand{ flex: 1 0 100%; order: 0; }
          .bm-actions{ flex: 1 0 100%; order: 1; justify-content:flex-start; gap:10px; }

          .bm-logo-wrap{ width:44px; height:44px; }

          .bm-brand-title,
          .bm-brand-tagline{
            white-space: normal;         /* إلغاء القصّ */
            overflow: visible;
            text-overflow: clip;
            max-width: 100%;             /* اسم + توصيف بكامل العرض */
          }

          /* تقليل العناصر الثانوية قليلًا */
          .bm-userextra{ display:none; }
          .bm-logout-text{ display:none; }
          .bm-lang{ gap:6px; }
          .bm-langbtn{ padding:3px 6px; }
        }

        /* أصغر من 420px: مزيد من ضغط الفراغات */
        @media (max-width: 420px){
          .bm-actions{ gap:8px; }
          .bm-userchip{ padding:4px 8px; max-width: 180px; }
          .bm-username{ display:none; } /* نبقي الأيقونة فقط */
        }

        /* ===== تثبيت الـ Popovers/Dropdowns داخل الشاشة على الجوال ===== */
        /* نجعل كل عنصر داخل .bm-actions مرجعًا للتموضع */
        .bm-actions > * { position: relative; }

        @media (max-width: 576px){
          /* حاولنا تغطية أشهر مسميات القوائم المنبثقة */
          .bm-actions .dropdown-menu,
          .bm-actions .bm-popover,
          .bm-actions [data-popover],
          .bm-actions [role="dialog"].popover,
          .bm-actions .popover {
            position: absolute !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) translateY(8px) !important;
            top: calc(100% + 6px) !important;
            max-width: calc(100vw - 24px);
            width: max-content;
            min-width: 240px;
            inset-inline: auto; /* احتياط */
            z-index: 1050;
          }
        }
      `}</style>
    </>
  );
}
