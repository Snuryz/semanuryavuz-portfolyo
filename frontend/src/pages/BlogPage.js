import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import useReveal from "../hooks/useReveal";
import StatusMessage from "../components/StatusMessage";
import { formatDate, pad } from "../utils/format";
import "../styles/pages.css";
import "./blogPage.css";

/** Kapak görseli yoksa başlığın ilk harfiyle süslü bir pano gösterir. */
const PostArt = ({ post, large = false }) => (
  <div className={`post-art${large ? " post-art--large" : ""}`} aria-hidden="true">
    {post.cover ? (
      <img src={post.cover} alt="" loading="lazy" />
    ) : (
      <span className="post-art-letter">{post.title.trim().charAt(0)}</span>
    )}
  </div>
);

const PostMeta = ({ post }) => (
  <span className="post-card-meta">
    {post.category && <>{post.category} · </>}
    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
  </span>
);

const BlogPage = () => {
  const { data: posts, loading, error } = useApi("/posts/");
  const list = posts || [];
  const [featured, ...rest] = list;
  const categoryCount = new Set(list.map((p) => p.category).filter(Boolean)).size;
  const listRef = useReveal([list.length]);

  return (
    <div className="page page--blog">
      <div className="page-inner" ref={listRef}>
        <header className="section-head journal-head">
          <span className="section-eyebrow">Günce</span>
          <h1 className="section-title">Tüm Yazılarım</h1>
          <p className="section-lede">
            Öğrendiklerimi, düşündüklerimi ve üretirken biriktirdiklerimi
            kaleme aldığım sayfalar.
          </p>
          {list.length > 0 && (
            <p className="works-count">
              <span>{pad(list.length)}</span> yazı
              {categoryCount > 0 && (
                <>
                  <span className="works-count-star" aria-hidden="true">✦</span>
                  <span>{pad(categoryCount)}</span> kategori
                </>
              )}
            </p>
          )}
        </header>

        <StatusMessage
          loading={loading}
          error={error}
          empty={posts && posts.length === 0}
          emptyText="İlk yazı çok yakında."
        />

        {featured && (
          <article className="featured-post" data-reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="featured-art-link"
              tabIndex={-1}
              aria-hidden="true"
            >
              <PostArt post={featured} large />
            </Link>
            <div className="featured-body">
              <span className="featured-label">Son yazı</span>
              <PostMeta post={featured} />
              <h2 className="featured-title">
                <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="featured-excerpt">{featured.excerpt}</p>
              <div className="featured-footer">
                <Link to={`/blog/${featured.slug}`} className="work-cta">
                  Okumaya başla <span aria-hidden="true">&#8594;</span>
                </Link>
                <span className="reading-time">{featured.reading_minutes} dk okuma</span>
              </div>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <>
            <div className="archive-divider" aria-hidden="true">
              <span>Önceki yazılar</span>
            </div>

            <div className="post-grid">
              {rest.map((post) => (
                <article className="post-card" key={post.slug} data-reveal>
                  <PostArt post={post} />
                  <div className="post-card-body">
                    <PostMeta post={post} />
                    <h3 className="post-card-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>
                    <span className="post-card-more" aria-hidden="true">
                      {post.reading_minutes} dk okuma <span>&#8594;</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
