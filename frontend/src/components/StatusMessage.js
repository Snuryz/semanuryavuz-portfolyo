import React from "react";
import { Link } from "react-router-dom";
import { isNotFound } from "../utils/format";
import "./status.css";

/** Yükleniyor, hata, bulunamadı ve boş liste durumları için ortak mesaj. */
const StatusMessage = ({ loading, error, empty, emptyText, backTo, backLabel }) => {
  if (loading) {
    return (
      <div className="status" role="status">
        <span className="status-star" aria-hidden="true">
          ✦
        </span>
        Yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="status status--error" role="alert">
        {isNotFound(error)
          ? "Aradığınız içerik bulunamadı."
          : "İçerik şu an yüklenemedi. Lütfen biraz sonra tekrar deneyin."}
        {backTo && (
          <Link to={backTo} className="status-link">
            {backLabel}
          </Link>
        )}
      </div>
    );
  }

  if (empty) {
    return <div className="status">{emptyText}</div>;
  }

  return null;
};

export default StatusMessage;
