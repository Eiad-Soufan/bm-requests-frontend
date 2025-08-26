import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ModelTable from '../components/ModelTable';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // يظهر زر الإشعار لـ HR / Manager فقط
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  // الشكاوى (تبقى كما هي)
  useEffect(() => {
    const fetchComplaints = async () => {
      const role = (localStorage.getItem('userRole') || '').toLowerCase();
      const token = localStorage.getItem('access');
      let endpoint = '';

      if (role === 'employee') endpoint = '/api/complaints/my_complaints/';
      else if (role === 'hr') endpoint = '/api/complaints/hr_complaints/';
      else if (role === 'manager') endpoint = '/api/complaints/manager_complaints/';
      else return;

      try {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

  // الأقسام + النماذج + هوية المستخدم
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) { console.warn('No access token found'); return; }

        const [secRes, formRes, userRes] = await Promise.all([
          axios.get('/api/sections/', { headers: { Authorization: `Bearer ${token}` }}),
          axios.get('/api/forms/',    { headers: { Authorization: `Bearer ${token}` }}),
          axios.get('/api/current-user/', { headers: { Authorization: `Bearer ${token}` }})
        ]);

        setSections(secRes.data);
        setForms(formRes.data);

        // ✅ تحديد الإدارة حسب الدور (hr/manager)، لا نعتمد على is_staff
        const roleFromApi = (userRes?.data?.role || userRes?.data?.userRole || '').toLowerCase();
        const roleFromLocal = (localStorage.getItem('userRole') || '').toLowerCase();
        const role = roleFromApi || roleFromLocal;
        setIsAdmin(role === 'hr' || role === 'manager');

        if (secRes.data.length > 0) setActiveSection(secRes.data[0].id);
      } catch (error) {
        console.error('❌ فشل تحميل البيانات:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabClick = (sectionId) => setActiveSection(sectionId);
  const filteredForms = forms.filter(f => f.section && String(f.section.id) === String(activeSection));

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header t={t} i18n={i18n} />

      {/* Hero أقل ارتفاعًا والنص في الوسط */}
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <h1 className="dash-title">{t('dashboard_title')}</h1>
          <p className="dash-subtitle">
            {t('dashboard_subtitle', { defaultValue: 'Overview & quick actions' })}
          </p>
        </div>
      </section>

      <main className="flex-grow-1">
        <div className="container py-3 dash-content">
          {/* شريط علوي — زر إضافة إشعار محسّن بصريًا */}
          <div className="d-flex justify-content-end align-items-center mb-3 dash-bar">
            {isAdmin && (
              <button
                className="dash-action"
                onClick={() => navigate('/admin-notify')}
                aria-label={t('add_notification', { defaultValue: 'Add notification' })}
                title={t('add_notification', { defaultValue: 'Add notification' })}
              >
                {/* أيقونة جرس + علامة إضافة (SVG خفيف) */}
                <svg className="ic" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M12 22a2.1 2.1 0 0 0 2.1-2.1h-4.2A2.1 2.1 0 0 0 12 22Zm6.3-6.3v-4.2c0-3.066-1.641-5.628-4.5-6.318V4.8a1.8 1.8 0 0 0-3.6 0v.382c-2.859.69-4.5 3.252-4.5 6.318v4.2L4.2 17.7v1.2h15.6v-1.2l-1.5-1.5ZM13 8.4v2.4h2.4v1.8H13v2.4h-1.8v-2.4H8.8v-1.8h2.4V8.4H13Z"/>
                </svg>
                <span className="txt">{t('add_notification', { defaultValue: 'Add notification' })}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center">{t('loading')}</div>
          ) : (
            <>
              {/* Tabs */}
              <ul className="nav nav-tabs mb-3 flex-wrap justify-content-center dash-tabs">
                {sections.map((section, idx) => (
                  <li className="nav-item" key={section.id} style={{ animationDelay: `${0.06 * idx}s` }}>
                    <button
                      className={`nav-link ${section.id === activeSection ? 'active' : ''}`}
                      onClick={() => handleTabClick(section.id)}
                    >
                      {i18n.language === 'ar' ? section.name_ar : section.name_en}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Table */}
              <div className="dash-card">
                <ModelTable forms={filteredForms} t={t} i18n={i18n} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .dash-hero{
          direction:ltr;
          background:
            radial-gradient(1200px 200px at 20% -60%, rgba(255,255,255,.22), transparent 60%),
            linear-gradient(135deg, #10c48b, #0ea36b, #0a6f47);
          color:#fff;
          padding: 16px 16px;
          box-shadow: 0 8px 18px rgba(0,0,0,.12);
          animation: dashHeroIn .7s ease both;
        }
        .dash-hero-inner{
          max-width:980px; margin:0 auto;
          min-height:110px;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          text-align:center;
        }
        .dash-title{ margin:0; font-size:1.9rem; font-weight:900; text-shadow:0 1px 0 rgba(0,0,0,.12); }
        .dash-subtitle{ margin:6px 0 0; opacity:.96; }

        .dash-content{
          direction:ltr;
          margin-top:10px;
          animation: fadeInUp .7s ease both;
        }

        /* ===== زر إضافة إشعار (احترافي ومتناسق مع الهوية) ===== */
        .dash-action{
          display:inline-flex; align-items:center; gap:10px;
          padding:10px 14px;
          border:none; cursor:pointer; border-radius:14px;
          color:#fff; font-weight:900; letter-spacing:.2px;
          background:
            linear-gradient(135deg, #10c48b, #0ea36b);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.22),
            0 10px 22px rgba(0,0,0,.16);
          backdrop-filter: blur(4px) saturate(120%);
          -webkit-backdrop-filter: blur(4px) saturate(120%);
          transition: transform .12s ease, box-shadow .12s ease, filter .12s ease, opacity .12s ease;
        }
        .dash-action:hover{
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(0,0,0,.18), inset 0 0 0 1px rgba(255,255,255,.26);
          filter: saturate(112%);
        }
        .dash-action:active{ transform: translateY(0); opacity:.95; }
        .dash-action .ic{ display:block; opacity:.96; }
        .dash-action .txt{ display:inline-block; }

        .dash-tabs > li{ animation: fadeInUp .7s ease both; }
        .dash-card{
          background:#fff; border-radius:14px; padding:12px 10px;
          box-shadow:0 6px 18px rgba(0,0,0,.08);
          border:1px solid rgba(0,0,0,.05);
          animation: fadeInUp .7s ease both; animation-delay:.18s;
        }

        @keyframes fadeInUp{ from{opacity:0; transform:translateY(12px) scale(.985)} to{opacity:1; transform:translateY(0) scale(1)} }
        @keyframes dashHeroIn{ from{opacity:0; transform:translateY(-8px)} to{opacity:1; transform:translateY(0)} }

        @media (max-width:560px){
          .dash-hero{ padding:14px; }
          .dash-title{ font-size:1.6rem; }
          .dash-action{ padding:9px 12px; border-radius:12px; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
