import React from "react";
import Rating from "./Rating";
import "./workInfo.css";

/**
 * Kitap / film yazılarında eserin künyesi: kapak, ad, yazar ya da yönetmen, yıl ve puan.
 * Yazıda eser adı girilmemişse hiçbir şey göstermez.
 */
const WorkInfo = ({ post }) => {
  if (!post.work_title) return null;
  const creatorLabel = post.category?.creator_label || "Eser sahibi";

  return (
    <aside className="work-info-card">
      {post.cover && (
        <div className="work-info-cover">
          <img src={post.cover} alt={`${post.work_title} kapağı`} />
        </div>
      )}
      <dl className="work-info-list">
        <div>
          <dt>Eser</dt>
          <dd className="work-info-title">{post.work_title}</dd>
        </div>
        {post.work_creator && (
          <div>
            <dt>{creatorLabel}</dt>
            <dd>{post.work_creator}</dd>
          </div>
        )}
        {post.work_year && (
          <div>
            <dt>Yıl</dt>
            <dd>{post.work_year}</dd>
          </div>
        )}
        {post.rating && (
          <div>
            <dt>Puanım</dt>
            <dd>
              <Rating value={post.rating} className="rating--large" />
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
};

/** Kart ve listelerde kısa eser satırı: "Sabahattin Ali · 1943" */
export const workLine = (post) =>
  [post.work_creator, post.work_year].filter(Boolean).join(" · ");

export default WorkInfo;
