// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import logo2 from '../assets/logo2.png';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');

  const isAR = (i18n.language || 'en').startsWith('ar');
  const changeLang = (code) => i18n.changeLanguage(code);

  useEffect(() => {
    // تنظيف أي جلسة سابقة لضمان سلوك متوقع
    ['access','refresh','token','access_token','refresh_token','userRole','userId','username','id']
      .forEach(k => localStorage.removeItem(k));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErr('');
    setLoading(true);
    try {
      // 1) توكن
      let res = await axios.post('/api/token/', { username, password });
      const { access, refresh } = res.data || {};
      if (!access) throw new Error('No access token');
      localStorage.setItem('access', access);
      if (refresh) localStorage.setItem('refresh', refresh);

      // 2) بيانات المستخدم
      const ures = await axios.get('/api/current-user/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      const u = ures.data || {};
      const role = (u.role || u.userRole || 'employee').toLowerCase();
      const uid  = u.id;
      const uname = u.username || username;

      localStorage.setItem('userRole', role);
      if (uid !== undefined) localStorage.setItem('userId', uid);
      localStorage.setItem('username', uname);

      navigate('/dashboard');
    } catch (e1) {
      setErr(t('login.error', { defaultValue: 'Invalid username or password.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        {/* خلفية بتدرّج أقوى */}
        <div className="login-bg" />

        {/* Hero بنفس أنيميشن بقية الصفحات */}
        <section className="login-hero">
          <div className="login-hero-inner">
            <div className="brand">
              <div className="brand-logo"><img src={logo2} alt="logo" /></div>
              <div className="brand-text">
                <h1 className="brand-title">{t('system_title', { defaultValue: 'Berkat Madinah Portal' })}</h1>
                <p className="brand-sub">{t('system_subtitle', { defaultValue: 'Internal portal for forms, approvals & communications' })}</p>
              </div>
            </div>

            {/* مبدّل اللغة */}
            <div className="lang-switch" aria-label="Language switch">
              <button className={`lang-btn ${isAR ? 'active' : ''}`} onClick={() => changeLang('ar')}>AR</button>
              <span className="lang-sep">|</span>
              <button className={`lang-btn ${!isAR ? 'active' : ''}`} onClick={() => changeLang('en')}>EN</button>
            </div>
          </div>
        </section>

        {/* بطاقة تسجيل الدخول (زجاجية) */}
        <section className="login-content">
          <form className={`login-card ${isAR ? 'rtl' : ''}`} onSubmit={handleSubmit}>
            <h2 className="card-title">{t('login.signin', { defaultValue: 'Sign in' })}</h2>

            {err && <div className="card-error">{err}</div>}

            <div className="field">
              <label>{t('login.username', { defaultValue: 'Username' })}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('login.username_ph', { defaultValue: 'Enter your username' })}
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label>{t('login.password', { defaultValue: 'Password' })}</label>
              <div className="pwd-wrap">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.password_ph', { defaultValue: 'Enter your password' })}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  title={showPwd ? t('login.hide', { defaultValue: 'Hide' }) : t('login.show', { defaultValue: 'Show' })}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* 🔥 تمت إزالة تذكرني كما طلبت */}

            <button className="submit" type="submit" disabled={loading}>
              {loading ? t('login.loading', { defaultValue: 'Signing in…' }) : t('login.signin', { defaultValue: 'Sign in' })}
            </button>
          </form>
        </section>
      </div>

      {/* ====== Styles (قوي + زجاج + نفس الأنيميشن) ====== */}
      <style>{`
        :root{
          --gA:#13d19e; --g1:#10c48b; --g2:#0ea36b; --g3:#0a6f47; --g4:#064e39; /* درجات أقوى */
          --white:#fff; --ink:#0a6f47;
          --radius:16px;
        }
        .login-page{ position:relative; min-height:100vh; direction:ltr; overflow:hidden; background:#eef6f2; }
        .login-bg{
          position:absolute; inset:0; z-index:0;
          background:
            radial-gradient(1400px 260px at 16% -60%, rgba(255,255,255,.28), transparent 60%),
            radial-gradient(900px 200px at 100% 0%, rgba(255,255,255,.12), transparent 60%),
            linear-gradient(135deg,
              var(--gA) 0%,
              var(--g1) 18%,
              var(--g2) 48%,
              var(--g3) 78%,
              var(--g4) 100%
            );
          filter: saturate(120%) contrast(105%);
          opacity: .98; /* أقوى */
        }

        /* Hero */
        .login-hero{ position:relative; z-index:1; padding: 16px; animation: heroIn .8s ease both; }
        .login-hero-inner{
          max-width: 980px; margin: 0 auto;
          min-height: 110px; display:flex; align-items:center; justify-content:space-between;
        }
        .brand{ display:flex; align-items:center; gap:12px; }
        .brand-logo{
          width:56px; height:56px; border-radius:12px;
          background: rgba(255,255,255,.16); display:grid; place-items:center;
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.22); overflow:hidden;
        }
        .brand-logo img{ width:100%; height:100%; object-fit:contain; display:block; }
        .brand-title{ margin:0; color:#fff; font-weight:900; font-size:1.6rem; text-shadow:0 1px 0 rgba(0,0,0,.12); }
        .brand-sub{ margin:4px 0 0; color:#f2fffa; opacity:.95; }

        /* Language */
        .lang-switch{ display:flex; align-items:center; gap:8px; background: rgba(255,255,255,.16); padding:6px 8px; border-radius:12px; }
        .lang-btn{ border:none; background:transparent; color:#fff; font-weight:900; padding:4px 8px; border-radius:8px; cursor:pointer; }
        .lang-btn.active{ background: rgba(255,255,255,.3); }
        .lang-sep{ color: rgba(255,255,255,.7); font-weight:800; }

        /* Card */
        .login-content{ position:relative; z-index:2; }
        .login-card{
          width:100%; max-width: 520px; margin: 14px auto 36px; padding: 22px 18px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.45);
          border-radius: var(--radius);
          box-shadow: 0 16px 40px rgba(0,0,0,.20);
          backdrop-filter: blur(12px) saturate(135%);
          -webkit-backdrop-filter: blur(12px) saturate(135%);
          animation: fadeInUp .8s ease both;
        }
        .login-card.rtl{
          direction: rtl; text-align: right;   /* ✅ قلب كامل للفورم */
        }
        .card-title{ margin:0 0 12px; font-weight:900; color:var(--ink); }
        .card-error{
          background:#ffe6e6; color:#b00020; border:1px solid #ffbcbc;
          border-radius:10px; padding:10px 12px; margin-bottom:10px; font-weight:700;
        }

        .field{ display:flex; flex-direction:column; gap:6px; margin-top:10px; }
        .field label{ font-weight:800; color:var(--ink); }
        .field input{
          border-radius:12px; border:1px solid rgba(10,111,71,.28); padding:10px 12px; font-weight:600;
          outline:none; transition: box-shadow .15s ease, border-color .15s ease; background:#fff;
        }
        /* إتاحة مساحة لزر العين */
        .pwd-wrap input{ padding-right: 36px; }
        .login-card.rtl .pwd-wrap input{ padding-right: 12px; padding-left: 36px; text-align: right; } /* ✅ RTL */

        .pwd-wrap{ position:relative; }
        .pwd-toggle{
          position:absolute; right:8px; top:50%; transform:translateY(-50%);
          border:none; background:transparent; font-size:18px; line-height:1; cursor:pointer; opacity:.85;
        }
        .login-card.rtl .pwd-toggle{ right:auto; left:8px; } /* ✅ وضع الزر يسار عند RTL */
        .pwd-toggle:hover{ opacity:1; }

        .submit{
          margin-top:14px; width:100%; padding:12px 14px; border-radius:12px; border:none; color:#fff;
          font-weight:900; letter-spacing:.2px; cursor:pointer;
          background: linear-gradient(135deg, var(--gA), var(--g1) 25%, var(--g2) 60%);
          box-shadow: 0 10px 26px rgba(0,0,0,.22);
          transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
        }
        .submit:hover{ transform: translateY(-1px); box-shadow: 0 14px 32px rgba(0,0,0,.24); filter: saturate(112%); }
        .submit:disabled{ opacity:.7; cursor:not-allowed; }

        /* Animations */
        @keyframes fadeInUp{ from{opacity:0; transform:translateY(12px) scale(.985)} to{opacity:1; transform:translateY(0) scale(1)} }
        @keyframes heroIn{ from{opacity:0; transform:translateY(-8px)} to{opacity:1; transform:translateY(0)} }

        @media (max-width:560px){
          .login-hero-inner{ min-height: 96px; }
          .brand-title{ font-size: 1.4rem; }
          .login-card{ margin: 12px 16px 28px; }
        }
      `}</style>
    </>
  );
}
