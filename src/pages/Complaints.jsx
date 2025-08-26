// src/pages/Complaints.jsx
// ✅ تعديل المطلوب فقط:
// 1) زر الرجوع → إلى الداشبورد.
// 2) إضافة الهيدر والفوتر.
// ⚠️ لا تغييرات وظيفية على الاستدعاءات أو المنطق.

import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { Button, Card, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBlockedAlert, setShowBlockedAlert] = useState(false);
  const { t, i18n } = useTranslation();

  const userRole = localStorage.getItem('userRole'); // 'employee' | 'manager' | 'hr'
  const navigate = useNavigate();

  // حدّد مسار الجلب بحسب الدور (بدون تعديل)
  const endpointRef = useRef('');
  if (userRole === 'employee') endpointRef.current = '/api/complaints/my_complaints/';
  else if (userRole === 'hr') endpointRef.current = '/api/complaints/hr_complaints/';
  else if (userRole === 'manager') endpointRef.current = '/api/complaints/manager_complaints/';

  const fetchComplaints = async () => {
    if (!endpointRef.current) return;
    const token = localStorage.getItem('access');
    const res = await axios.get(endpointRef.current, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data || []);
  };

  // تحميل أولي + تحديث دوري وعلى تركيز النافذة (بدون تعديل)
  useEffect(() => {
    (async () => { await fetchComplaints(); })();
    const id = setInterval(fetchComplaints, 10000);
    const onFocus = () => fetchComplaints();
    const onVis = () => { if (!document.hidden) fetchComplaints(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // تعليم شكوى كمقروءة عند فتح التفاصيل (بدون تعديل)
  const markSeen = async (id) => {
    try {
      await axios.post(`/api/complaints/${id}/mark_seen/`);
    } catch (e) {
      // صامت
    }
  };

  const handleSelect = async (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
    await markSeen(complaint.id);
    await fetchComplaints();
  };

  const handleReplySubmit = async () => {
    if (!selectedComplaint) return;
    const endpoint = `/api/complaints/${selectedComplaint.id}/${userRole}_reply/`; // hr_reply | manager_reply
    await axios.post(endpoint, { response: reply });
    setShowModal(false);
    setReply('');
    await fetchComplaints();
  };

  const handleSubmitComplaint = () => {
    if (userRole !== 'employee') {
      setShowBlockedAlert(true);
      return;
    }
    navigate('/submit-complaint'); // كما هو
  };

  // منطق النقطة الحمراء كما هو
  const isUnreadForMe = (c) => {
    if (userRole === 'employee') {
      return c.is_responded && !c.is_seen_by_employee;
    }
    if (userRole === 'manager' || userRole === 'hr') {
      return !c.is_seen_by_recipient;
    }
    return false;
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* ✅ الهيدر */}
      <Header />

      <main className="flex-grow-1">
        <div className="container my-4 complaints-ui">
          {/* شريط العنوان + زر الرجوع (إلى الداشبورد) */}
          <div className="d-flex justify-content-between align-items-center mb-3 cmp-headbar">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                className="btn-glass"
                onClick={() => navigate('/dashboard')}  
                title={t('backtodash', { defaultValue: 'back to dashboard' })}
              >
                ← {t('backtodash', { defaultValue: 'back to dashboard' })}
              </Button>
              <h2 className="m-0 cmp-title">{t('complaints', { defaultValue: 'complaints' })}</h2>
            </div>
            <Button variant="dark" className="btn-grad btn-elev" onClick={handleSubmitComplaint}>
              {t('submitnewcomplain', { defaultValue: 'submit new complain' })}
            </Button>
          </div>

          {showBlockedAlert && (
            <Alert variant="warning" onClose={() => setShowBlockedAlert(false)} dismissible className="cmp-alert">
              {t('submit_complain_error', { defaultValue: 'submit_complain_error' })}
            </Alert>
          )}

          {complaints.length === 0 ? (
            <div className="text-center text-muted py-5 cmp-emptybox">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2">No complaints to display at the moment.</p>
            </div>
          ) : (
            complaints.map((c, i) => (
              <Card
                key={c.id}
                className="mb-3 shadow-sm position-relative cmp-card"
                role="button"
                onClick={() => handleSelect(c)}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Card.Body>
                  <Card.Title className="position-relative cmp-card-title">
                    {c.title}
                    {isUnreadForMe(c) && (
                      <span
                        className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle notif-dot"
                        style={{ top: 0, right: 0 }}
                      >
                        <span className="visually-hidden">New</span>
                      </span>
                    )}
                  </Card.Title>

                  <Card.Subtitle className="text-muted cmp-sub">
                    {(userRole === 'manager' || userRole === 'hr') && <>From: {c.sender_username}<br /></>}
                    Sent to: {c.recipient_display} | {new Date(c.created_at).toLocaleString()}
                  </Card.Subtitle>

                  {c.is_responded && (
                    <div className="mt-2">
                      <strong>Response:</strong>{' '}
                      <span className="text-muted">
                        {(c.response || '').slice(0, 140)}{(c.response || '').length > 140 ? '…' : ''}
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          )}

          {/* Modal التفاصيل (بدون تغيير وظيفي) */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered contentClassName="cmp-modal">
            <Modal.Header closeButton className="cmp-modal-head">
              <Modal.Title>Complaint Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Title:</strong> {selectedComplaint?.title}</p>
              <p className="mb-2"><strong>Message:</strong></p>
              <div className="p-2 border rounded bg-light cmp-msg">{selectedComplaint?.message}</div>

              {selectedComplaint?.is_responded ? (
                <>
                  <hr />
                  <p className="mb-2"><strong>Response:</strong></p>
                  <div className="p-2 border rounded bg-white cmp-resp">{selectedComplaint?.response}</div>
                </>
              ) : (userRole !== 'employee') && (
                <>
                  <hr />
                  <Form.Group className="mb-3">
                    <Form.Label>Write Response</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="cmp-modal-foot">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              {(!selectedComplaint?.is_responded && userRole !== 'employee') && (
                <Button variant="primary" className="btn-grad" onClick={handleReplySubmit}>Send Reply</Button>
              )}
            </Modal.Footer>
          </Modal>
        </div>
      </main>

      {/* ✅ الفوتر */}
      <Footer />

      {/* ===== Styles: تصميم فقط ===== */}
      <style>{`
        :root{
          --g1:#10c48b; --g2:#0ea36b; --g3:#0a6f47;
          --ink:#063b28; --ink2:#1b4d3a;
          --danger:#e75162;
        }

        /* خلفية خفيفة وحواف ناعمة لعناصر الصفحة */
        .complaints-ui{
          animation: fadePage .5s ease both;
        }

        /* شريط أعلى أنيق */
        .cmp-headbar{
          padding: 10px 12px;
          background:
            radial-gradient(800px 140px at 20% -80%, rgba(255,255,255,.22), transparent 60%),
            linear-gradient(135deg, var(--g1), var(--g2), var(--g3));
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,.10);
          color:#fff;
        }
        .cmp-title{
          color:#fff; font-weight: 900;
          text-shadow: 0 1px 0 rgba(0,0,0,.15);
        }

        /* الأزرار */
        .btn-glass{
          background: rgba(255,255,255,.15) !important;
          border: 1px solid rgba(255,255,255,.35) !important;
          color: #fff !important;
          font-weight: 700;
          backdrop-filter: blur(6px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
        }
        .btn-glass:hover{ background: rgba(255,255,255,.22) !important; transform: translateY(-1px); }

        .btn-grad{
          background-image: linear-gradient(135deg, var(--g1), var(--g2)) !important;
          border: none !important;
          font-weight: 800;
        }
        .btn-elev{
          box-shadow: 0 10px 22px rgba(0,0,0,.12);
          transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
        }
        .btn-elev:hover{
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(0,0,0,.16);
          filter: saturate(110%);
        }

        /* التنبيه */
        .cmp-alert{
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,.08);
        }

        /* حالة لا يوجد */
        .cmp-emptybox{
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 18px rgba(0,0,0,.08);
        }

        /* البطاقات */
        .cmp-card{
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,.06);
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, filter .12s ease;
          animation: fadeInUp .5s ease both;
          background:
            radial-gradient(600px 140px at -10% -80%, rgba(16,196,139,.06), transparent 60%),
            #fff;
        }
        .cmp-card:hover{
          transform: translateY(-2px);
          box-shadow: 0 14px 26px rgba(0,0,0,.14);
          border-color: rgba(16,196,139,.25);
          filter: saturate(108%);
        }
        .cmp-card-title{
          font-weight: 900;
          color: var(--ink);
          padding-right: 24px; /* مساحة للنقطة */
        }

        .cmp-sub{ margin-top: 2px; }

        /* النقطة الحمراء — مع وهج لطيف */
        .notif-dot{
          box-shadow: 0 0 0 2px #fff;
        }
        .notif-dot::after{
          content: '';
          position: absolute; inset: -4px;
          border-radius: 999px;
          background: rgba(231,81,98,.28);
          filter: blur(2px);
          z-index: -1;
          animation: ping 1.4s ease-out infinite;
        }

        /* Modal تحسين بسيط */
        .cmp-modal .modal-content{
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 18px 42px rgba(0,0,0,.22);
          border: 1px solid rgba(0,0,0,.06);
        }
        .cmp-modal-head{
          background:
            radial-gradient(600px 120px at 20% -80%, rgba(255,255,255,.22), transparent 60%),
            linear-gradient(135deg, var(--g1), var(--g2), var(--g3));
          color:#fff;
        }
        .cmp-modal-foot{
          background: #f6faf8;
        }
        .cmp-msg, .cmp-resp{
          white-space: pre-wrap; /* يحافظ على الأسطر */
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadePage {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping{
          0%{ transform: scale(.95); opacity: .8; }
          80%{ transform: scale(1.25); opacity: 0; }
          100%{ transform: scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Complaints;
