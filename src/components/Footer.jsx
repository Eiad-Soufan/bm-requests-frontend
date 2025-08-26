// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const devName   = 'Eiad Soufan';
  const brandName = t('system_title', { defaultValue: 'Berkat Madinah Portal' });
  const isAR = (i18n.language || '').startsWith('ar');
  const year = new Date().getFullYear();

  // نص الحقوق (محلّي)
  const rightsText =
    t('rights_reserved_full', {
      defaultValue: isAR ? `جميع الحقوق محفوظة لشركة ${brandName}` : `All rights reserved for ${brandName}`,
    });

  return (
    <>
      <footer className="bm-footer" role="contentinfo" aria-label="Site footer">
        <div className="bm-footer-inner">
          {/* العمود الأيسر: العلامة + حقوق */}
          <div className="bm-col bm-col-left">
            <div className="bm-brand" title={brandName} dir="auto">{brandName}</div>
            <div className="bm-copy" dir="auto">
              {rightsText} · © {year}
            </div>
          </div>

          {/* العمود الأوسط: روابط */}
          <nav className="bm-col bm-col-middle" aria-label="Footer Navigation">
            <ul className="bm-nav">
              <li>
                <Link to="/policies" className="bm-a">
                  {t('policies.title', { defaultValue: 'Company Policies' })}
                </Link>
              </li>
            </ul>
          </nav>

          {/* العمود الأيمن: المطوّر */}
          <div className="bm-col bm-col-right">
            <span className="bm-dev">
              <span className="bm-dev-label">
                {t('developed_by', { defaultValue: 'Developed by' })}
              </span>{' '}
              <strong className="bm-dev-name" title={`Developed by ${devName}`}>
                {devName}
              </strong>
            </span>
          </div>
        </div>
      </footer>

      {/* ============ Styles ============ */}
      <style>{`
        .bm-footer{
          direction:ltr;
          --bm-radius:12px;
          --bm-white:#fff;
          --bm-green-1:#10c48b; --bm-green-2:#0ea36b; --bm-green-3:#0a6f47;
          --bm-divider:rgba(255,255,255,.18); --bm-link:rgba(255,255,255,.95); --bm-linkHover:#ffffff;

          background:
            radial-gradient(900px 160px at 20% -40%, rgba(255,255,255,.10), transparent 60%),
            linear-gradient(135deg, var(--bm-green-1), var(--bm-green-2), var(--bm-green-3));
          color:var(--bm-white);
          padding: max(20px, env(safe-area-inset-top)) 16px max(20px, env(safe-area-inset-bottom)) 16px;
          box-shadow: 0 -8px 18px rgba(0,0,0,.08);
          border-top: 1px solid var(--bm-divider);
        }

        .bm-footer-inner{
          max-width:1200px; margin:0 auto;
          display:grid; grid-template-columns: 1fr auto 1fr;
          gap:clamp(10px, 2.5vw, 16px); align-items:center;
        }

        /* الأعمدة */
        .bm-col{ min-width:0; }
        .bm-col-left{
          display:flex; align-items:center; gap:10px;
          flex-wrap:wrap;            /* ✅ يسمح للحقوق بالانتقال لسطر جديد */
        }

        .bm-brand{
          font-weight:900; text-shadow:0 1px 0 rgba(0,0,0,.08);
          font-size:clamp(14px, 2.4vw, 18px);
          max-width:100%;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; /* على الديسكتوب فقط */
        }

        .bm-copy{
          opacity:.95; font-weight:600; font-size:clamp(12px, 2vw, 14px);
          max-width:100%;
          white-space:normal; overflow:visible; text-overflow:clip;    /* ✅ لا قصّ */
        }

        .bm-col-middle{ display:flex; justify-content:center; }
        .bm-nav{ display:flex; flex-wrap:wrap; gap:clamp(10px, 2.2vw, 18px); list-style:none; padding:0; margin:0; }
        .bm-a{ color:var(--bm-link); text-decoration:none; font-weight:800; letter-spacing:.2px;
               border-bottom: 1px solid transparent; transition: border-color .15s, color .15s; }
        .bm-a:hover{ color:var(--bm-linkHover); border-bottom-color: var(--bm-linkHover); }

        .bm-col-right{ display:flex; justify-content:flex-end; min-width:0; }
        .bm-dev{ font-weight:700; white-space:nowrap; font-size:clamp(12px, 2.2vw, 14px); }
        .bm-dev-label{ opacity:.95; }
        .bm-dev-name{
          position:relative; font-weight:900;
          background: linear-gradient(90deg,#ff7a59,#ff4ecd,#7b61ff,#1e90ff,#00d1b2,#ffd36e,#ff7a59);
          background-size:220% 220%; -webkit-background-clip:text; background-clip:text; color:transparent;
          animation: bmGradientShift 7s linear infinite;
        }
        .bm-dev-name::after{ content:""; position:absolute; left:0; right:0; bottom:-2px; height:2px;
          background: inherit; background-size: inherit; animation: bmGradientShift 7s linear infinite; border-radius:2px; opacity:.9; }
        @keyframes bmGradientShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        /* تجاوبية: على الجوال نجعل الاسم بلا قصّ والحقوق تحتَه مباشرة */
        @media (max-width: 900px){
          .bm-footer-inner{ grid-template-columns: 1fr; }
          .bm-col-left, .bm-col-middle, .bm-col-right{ justify-content:flex-start; }
          .bm-brand{ white-space:normal; overflow:visible; text-overflow:clip; } /* ✅ التفاف الاسم */
        }

        /* احترام تقليل الحركة والتباين */
        @media (prefers-reduced-motion: reduce){
          .bm-dev-name, .bm-dev-name::after{ animation:none !important; }
        }
        @media (forced-colors: active){
          .bm-dev-name{ color:ButtonText; background:none; }
          .bm-dev-name::after{ display:none; }
        }
      `}</style>
    </>
  );
}
