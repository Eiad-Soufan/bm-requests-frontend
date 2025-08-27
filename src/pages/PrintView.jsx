import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function PrintView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const formUrl = useMemo(() => {
    if (!id) return "";
    const base = (process.env.REACT_APP_API_BASE || "").replace(/\/+$/, "");
    return `${base}/api/preview-form/${id}/`;
  }, [id]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* زر طباعة أو فتح في تبويب جديد (آمن للإطارات) */}
      <div
        className="print-button"
        onClick={() => formUrl && window.open(formUrl, "_blank", "noopener,noreferrer")}
      >
        <span role="img" aria-label="printer" className="printer-icon">🖨️</span>
        <span className="print-text">طباعة النموذج</span>
      </div>

      {/* جرّب عرض الإطار أيضًا؛ لو مُنع بسبب X-Frame سيفتح الزر التبويب الجديد */}
      {formUrl ? (
        <iframe
          src={formUrl}
          title="نموذج للطباعة"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <div style={{ padding: 20, textAlign: "center" }}>جارٍ تحميل النموذج...</div>
      )}

      <style>{`
        .print-button {
          position: absolute; top: 25px; right: 25px;
          background: linear-gradient(to right, #1e7f4d, #28a745);
          color: white; padding: 14px 24px; border-radius: 12px;
          cursor: pointer; font-size: 18px; font-weight: bold; z-index: 1000;
          display: flex; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,.2);
          transition: transform .2s ease;
        }
        .print-button:hover { transform: scale(1.05); }
        .printer-icon { margin-left: 10px; font-size: 24px; animation: pulse 1.2s infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @media print { .print-button { display:none } }
      `}</style>
    </div>
  );
}

export default PrintView;
