import React, { useState } from "react";

const PANEL_WIDTH = 0.72; // her parçanın kutu genişliğine oranı
const STEP = 0.2; // parçalar arası dikey kayma (genişliğe oranla)
const TALL_LIMIT = 1.3; // yükseklik/genişlik bundan büyükse görsel "uzun" sayılır

/**
 * Uzun bir ekran görüntüsünü üst / orta / alt olmak üzere tam üç eşit parçaya
 * böler ve parçaları çapraz, üst üste binen kartlar gibi dizer.
 * Yatay ya da kısa görseller bölünmeden tek bir çerçevede gösterilir.
 */
const ScreenshotCascade = ({ src, reverse = false }) => {
  const [size, setSize] = useState(null);

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setSize({ w, h });
  };

  // Yatay / kısa görsel: tek pano
  if (size && size.h / size.w < TALL_LIMIT) {
    return (
      <div className="cascade-single" style={{ aspectRatio: `${size.w} / ${size.h}` }}>
        <img src={src} alt="" />
      </div>
    );
  }

  // Bir parçanın en/boy oranı = genişlik / (yükseklik / 3)
  const sliceRatio = size ? (3 * size.w) / size.h : 1.7;
  const panelHeight = PANEL_WIDTH / sliceRatio;
  const totalHeight = panelHeight + 2 * STEP;

  return (
    <div
      className={`cascade${reverse ? " cascade--reverse" : ""}`}
      style={{ aspectRatio: `1 / ${totalHeight}` }}
    >
      {[0, 1, 2].map((i) => (
        <div
          className="cascade-panel"
          key={i}
          style={{
            width: `${PANEL_WIDTH * 100}%`,
            height: `${(panelHeight / totalHeight) * 100}%`,
            top: `${((i * STEP) / totalHeight) * 100}%`,
            [reverse ? "right" : "left"]: `${i * ((1 - PANEL_WIDTH) / 2) * 100}%`,
          }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            style={{ transform: `translateY(-${(i * 100) / 3}%)` }}
            onLoad={i === 0 ? handleLoad : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ScreenshotCascade;
