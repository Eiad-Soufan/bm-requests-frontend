// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  // ✅ اسم المطوّر (ثابت كما طلبت)
  const devName = 'Eiad Soufan';

  // اسم النظام من i18n (مع قيمة افتراضية إن لم يوجد مفتاح)
  const brandName = t('system_title', { defaultValue: 'Berkat Madinah Portal' });

  return (
    <>
      <footer className="bm-footer">
        <div className="bm-footer-inner">
          {/* العمود الأيسر: العلامة + حقوق */}
          <div className="bm-col bm-col-left">
            <div className="bm-brand">{brandName}</div>
            <div className="bm-copy">© {new Date().getFullYear()}</div>
          </div>

          {/* العمود الأوسط: روابط نصية (Hyperlinks) */}
          <nav className="bm-col bm-col-middle" aria-label="Footer Navigation">
            <ul className="bm-nav">
              <li>
                <Link to="/policies" className="bm-a">
                  {t('policies.title', { defaultValue: 'Company Policies' })}
                </Link>
              </li>
              {/* يمكنك إضافة روابط أخرى لاحقاً بنفس النمط */}
              {/* <li><Link to="/contact" className="bm-a">Contact</Link></li> */}
            </ul>
          </nav>

          {/* العمود الأيمن: وسام المطوّر (نص متدرّج متحرك) */}
          <div className="bm-col bm-col-right">
            <span className="bm-dev">
              <span className="bm-dev-label">
                {t('developed_by', { defaultValue: 'Developed by' })}
              </span>
              &nbsp;
              <strong className="bm-dev-name" title={`Developed by ${devName}`}>
                {devName}
              </strong>
            </span>
          </div>
        </div>
      </footer>

      {/* ============ Inline Styles ============ */}
      <style>{`
        :root{
          --bm-radius:12px;
          --bm-white:#fff;
          --bm-green-1:#10c48b; /* نفس درجات الهيدر */
          --bm-green-2:#0ea36b;
          --bm-green-3:#0a6f47;
          --bm-divider:rgba(255,255,255,.18);
          --bm-link:rgba(255,255,255,.95);
          --bm-linkHover:#ffffff;
        }

        .bm-footer{
          direction:ltr; /* ثابت LTR */
          background:
            radial-gradient(900px 160px at 20% -40%, rgba(255,255,255,.10), transparent 60%),
            linear-gradient(135deg, var(--bm-green-1), var(--bm-green-2), var(--bm-green-3));
          color:var(--bm-white);
          padding:24px 16px;
          box-shadow: 0 -8px 18px rgba(0,0,0,.08);
          border-top: 1px solid var(--bm-divider);
        }

        .bm-footer-inner{
          max-width:1200px; margin:0 auto;
          display:grid; grid-template-columns: 1fr auto 1fr;
          gap:16px; align-items:center;
        }

        /* الأعمدة */
        .bm-col{ min-width:0; }
        .bm-col-left{ display:flex; align-items:center; gap:10px; }
        .bm-brand{
          font-weight:900; text-shadow:0 1px 0 rgba(0,0,0,.08);
        }
        .bm-copy{ opacity:.9; font-weight:600; }

        .bm-col-middle{ display:flex; justify-content:center; }
        .bm-nav{
          display:flex; gap:18px; list-style:none; padding:0; margin:0;
        }
        .bm-a{
          color:var(--bm-link); text-decoration:none; font-weight:800; letter-spacing:.2px;
          border-bottom: 1px solid transparent;
          transition: border-color .15s ease, color .15s ease, opacity .15s ease;
        }
        .bm-a:hover{
          color:var(--bm-linkHover); border-bottom-color: var(--bm-linkHover);
        }

        .bm-col-right{ display:flex; justify-content:flex-end; }
        .bm-dev{ font-weight:700; white-space:nowrap; }

        /* نص المطوّر — تدرّج متحرك وبارز */
        .bm-dev-label{ opacity:.95; }
        .bm-dev-name{
          position:relative;
          font-weight:900;
          background: linear-gradient(90deg,
            #ff7a59, #ff4ecd, #7b61ff, #1e90ff, #00d1b2, #ffd36e, #ff7a59
          );
          background-size: 220% 220%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: bmGradientShift 7s linear infinite;
        }
        .bm-dev-name::after{
          content:"";
          position:absolute; left:0; right:0; bottom:-2px; height:2px;
          background: linear-gradient(90deg,
            #ff7a59, #ff4ecd, #7b61ff, #1e90ff, #00d1b2, #ffd36e, #ff7a59
          );
          background-size: 220% 220%;
          animation: bmGradientShift 7s linear infinite;
          border-radius:2px; opacity:.9;
        }

        @keyframes bmGradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* تجاوبية */
        @media (max-width: 900px){
          .bm-footer-inner{
            grid-template-columns: 1fr; gap:10px;
          }
          .bm-col-middle{ justify-content:flex-start; }
          .bm-col-right{ justify-content:flex-start; }
        }
      `}</style>
    </>
  );
}
