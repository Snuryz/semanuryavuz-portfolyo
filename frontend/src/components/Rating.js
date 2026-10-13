import React from "react";
import "./rating.css";

/** 1–5 arası puanı altın yıldızlarla gösterir. */
const Rating = ({ value, className = "" }) => {
  if (!value) return null;
  return (
    <span className={`rating ${className}`} aria-label={`5 üzerinden ${value} puan`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? "rating-on" : "rating-off"} aria-hidden="true">
          ✦
        </span>
      ))}
    </span>
  );
};

export default Rating;
