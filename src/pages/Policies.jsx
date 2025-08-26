// src/pages/Policies.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Policies() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isAR = lang.startsWith('ar');

  return (
    <>
      <Header />

      <div className="policies-wrapper">
        {/* Hero */}
        <section className="pol-hero">
          <div className="pol-hero-inner">
            <h1 className="pol-title">
              {t('policies.title', { defaultValue: 'Company Policies' })}
            </h1>
            <p className="pol-subtitle">
              {t('policies.subtitle', {
                defaultValue:
                  'This page outlines key internal policies for employees—working hours, leave, conduct, IT & security, privacy, and escalation.',
              })}
            </p>
          </div>
        </section>

        {/* كروت تحت بعض */}
        <section className="pol-content">
          {SECTIONS(t).map((sec, i) => (
            <article
              key={sec.key}
              className="pol-card"
              style={{ animationDelay: `${0.12 * i}s` }} // أبطأ لظهور التأثير
            >
              <div className="pol-card-head">
                <div className="pol-icon" aria-hidden>{sec.icon}</div>
                <h2 className="pol-card-title">{sec.title}</h2>
              </div>
              <ul className="pol-list">
                {sec.points.map((p, idx) => <li key={idx}>{p}</li>)}
              </ul>
            </article>
          ))}
        </section>
      </div>

      <Footer />

      {/* ==== Styles ==== */}
      <style>{`
        .policies-wrapper{
          direction:ltr;
          padding-bottom:24px;
          background:#f8faf9;
          min-height:60vh;
        }

        /* ✅ هيرو أقل ارتفاعًا والنص في الوسط تمامًا */
        .pol-hero{
          background:
            radial-gradient(1200px 200px at 20% -60%, rgba(255,255,255,.22), transparent 60%),
            linear-gradient(135deg, #10c48b, #0ea36b, #0a6f47);
          color:#fff;
          padding: 16px 16px;                  /* كان 48px/36px */
          box-shadow: 0 8px 18px rgba(0,0,0,.12);
          animation: polHeroIn .7s ease both;
        }
        .pol-hero-inner{
          max-width:980px; margin:0 auto;
          min-height:110px;                    /* ارتفاع بطلّة أنيقة */
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          text-align:center;                   /* ✅ وسط أفقي */
        }
        .pol-title{ margin:0; font-size:1.9rem; font-weight:900; text-shadow:0 1px 0 rgba(0,0,0,.12); }
        .pol-subtitle{ margin:6px 0 0; opacity:.96; font-size:1rem; max-width:900px; }

        /* المسافة تحت الهيرو أصغر */
        .pol-content{
          max-width:980px;
          margin:14px auto 0;                 /* كان 22px */
          padding:0 16px;
          display:flex; flex-direction:column; gap:16px;
        }

        .pol-card{
          background:#fff; border-radius:14px; padding:18px 16px;
          box-shadow:0 6px 18px rgba(0,0,0,.08);
          border:1px solid rgba(0,0,0,.05);
          animation: polFadeInUp .7s ease both;
        }
        .pol-card-head{ display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .pol-icon{
          width:36px; height:36px; border-radius:10px;
          display:grid; place-items:center; font-size:18px; color:#0a6f47;
          background:#e8fff6; box-shadow: inset 0 0 0 1px rgba(10,111,71,.12);
        }
        .pol-card-title{ margin:0; font-size:1.05rem; font-weight:800; color:#0a6f47; }
        .pol-list{ margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px; }
        .pol-list li{ line-height:1.7; }

        @keyframes polFadeInUp{ from{opacity:0; transform:translateY(12px) scale(.985)} to{opacity:1; transform:translateY(0) scale(1)} }
        @keyframes polHeroIn{ from{opacity:0; transform:translateY(-8px)} to{opacity:1; transform:translateY(0)} }

        @media (max-width:560px){
          .pol-hero{ padding:14px; }
          .pol-title{ font-size:1.6rem; }
        }
      `}</style>
    </>
  );
}

function SECTIONS(t){
  return [
    {
      key: 'working_hours',
      icon: '⏰',
      title: t('policies.working_hours.title', { defaultValue: 'Working Hours & Attendance' }),
      points: [
        t('policies.working_hours.p1', { defaultValue: 'Standard hours: 8:00–16:00 (Sun–Thu), with a 60-minute break.' }),
        t('policies.working_hours.p2', { defaultValue: 'Flexible arrival ±30 minutes; lateness beyond 15 minutes must be reported to HR.' }),
        t('policies.working_hours.p3', { defaultValue: 'Use the attendance system to check in/out. Remote check-ins must be pre-approved.' }),
      ],
    },
    {
      key: 'leave',
      icon: '🌴',
      title: t('policies.leave.title', { defaultValue: 'Leave & Absence Policy' }),
      points: [
        t('policies.leave.p1', { defaultValue: 'Annual leave requests must be submitted at least 7 days in advance.' }),
        t('policies.leave.p2', { defaultValue: 'Sick leave requires a medical certificate for absences longer than 1 day.' }),
        t('policies.leave.p3', { defaultValue: 'Emergency leave may be granted by the line manager and HR.' }),
      ],
    },
    {
      key: 'conduct',
      icon: '🤝',
      title: t('policies.conduct.title', { defaultValue: 'Code of Conduct' }),
      points: [
        t('policies.conduct.p1', { defaultValue: 'Respect, integrity, and professionalism are expected at all times.' }),
        t('policies.conduct.p2', { defaultValue: 'No harassment or discrimination. Violations will lead to disciplinary action.' }),
        t('policies.conduct.p3', { defaultValue: 'Conflicts of interest must be disclosed to management.' }),
      ],
    },
    {
      key: 'it',
      icon: '💻',
      title: t('policies.it.title', { defaultValue: 'IT & Security' }),
      points: [
        t('policies.it.p1', { defaultValue: 'Use strong passwords and enable multi-factor authentication where available.' }),
        t('policies.it.p2', { defaultValue: 'Company data must not be stored on personal devices without approval.' }),
        t('policies.it.p3', { defaultValue: 'Report phishing or suspicious emails to IT immediately.' }),
      ],
    },
    {
      key: 'privacy',
      icon: '🔒',
      title: t('policies.privacy.title', { defaultValue: 'Data Privacy' }),
      points: [
        t('policies.privacy.p1', { defaultValue: 'Access confidential data only if you are authorized and it is required for your role.' }),
        t('policies.privacy.p2', { defaultValue: 'Share data securely; do not send sensitive files via public channels.' }),
        t('policies.privacy.p3', { defaultValue: 'Follow retention guidelines; delete data when no longer needed.' }),
      ],
    },
    {
      key: 'complaints',
      icon: '📣',
      title: t('policies.complaints.title', { defaultValue: 'Complaints & Escalation' }),
      points: [
        t('policies.complaints.p1', { defaultValue: 'Use the internal Complaints module to raise concerns professionally.' }),
        t('policies.complaints.p2', { defaultValue: 'Line managers should respond within 2 business days; HR monitors escalations.' }),
        t('policies.complaints.p3', { defaultValue: 'Urgent cases (safety/harassment) must be escalated to HR immediately.' }),
      ],
    },
    {
      key: 'remote',
      icon: '🏠',
      title: t('policies.remote.title', { defaultValue: 'Remote & Hybrid Work' }),
      points: [
        t('policies.remote.p1', { defaultValue: 'Remote days require prior approval and clear deliverables.' }),
        t('policies.remote.p2', { defaultValue: 'Maintain availability on official communication tools during working hours.' }),
        t('policies.remote.p3', { defaultValue: 'Ensure secure network access (VPN) when handling company resources.' }),
      ],
    },
  ];
}
