import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import usePageMeta from "../hooks/usePageMeta";
import useReveal from "../hooks/useReveal";
import StatusMessage from "../components/StatusMessage";
import Rating from "../components/Rating";
import { workLine } from "../components/WorkInfo";
import { formatDate, pad } from "../utils/format";
import "../styles/pages.css";
import "./blogPage.css";

const DEFAULT_LEDE =
  "Öğrendiklerimi, düşündüklerimi ve üretirken biriktirdiklerimi kaleme aldığım sayfalar.";

/** Kapak görseli yoksa başlığın ilk harfiyle süslü bir pano gösterir. */
const PostArt = ({ post, large = false }) => (
  <div
    className={`post-art${large ? " post-art--large" : ""}${
      post.work_title ? " post-art--work" : ""
    }`}
    aria-hidden="true"
  >
    {post.cover ? (
      <img src={post.cover} alt="" loading="lazy" />
    ) : (
      <span className="post-art-letter">{(post.work_title || post.title).trim().charAt(0)}</span>
    )}
  </div>
);

const PostMeta = ({ post, showCategory }) => (
  <span className="post-card-meta">
    {showCategory && post.category && <>{post.category.name} · </>}
    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
  </span>
);

/** Kitap / film yazılarında eser satırı ve puan */
const PostWork = ({ post }) =>
  post.work_title ? (
    <span className="post-work">
      <span className="post-work-text">
        <em>{post.work_title}</em>
        {workLine(post) && <> — {workLine(post)}</>}
      </span>
      <Rating value={post.rating} />
    </span>
  ) : null;

const BlogPage = () => {
  const { category: categorySlug } = useParams();
  const { data: categories } = useApi("/categories/");
  const { data: posts, loading, error } = useApi(
    categorySlug ? `/posts/?category=${categorySlug}` : "/posts/"
  );

  const category = (categories || []).find((c) => c.slug === categorySlug);
  const unknownCategory = categorySlug && categories && !category;

  usePageMeta(
    category ? category.name : "Blog",
    category?.description ||
      "Sema Nur Yavuz'un yazılım, tasarım, kitaplar, filmler ve tarih üzerine yazıları."
  );

  const list = posts || [];
  const [featured, ...rest] = list;
  const listRef = useReveal([list.length, categorySlug]);

  return (
    <div className="page page--blog">
      <div className="page-inner" ref={listRef}>
        <header className="section-head journal-head">
          <span className="section-eyebrow">Günce</span>
          <h1 className="section-title">{category ? category.name : "Tüm Yazılarım"}</h1>
          <p className="section-lede">{category?.description || DEFAULT_LEDE}</p>
          {list.length > 0 && (
            <p className="works-count">
              <span>{pad(list.length)}</span> yazı
            </p>
          )}
        </header>

        {categories && categories.length > 0 && (
          <nav className="category-nav" aria-label="Blog kategorileri">
            <NavLink to="/blog" end className="category-link">
              Tümü
            </NavLink>
            {categories.map((c) => (
              <NavLink key={c.slug} to={`/blog/kategori/${c.slug}`} className="category-link">
                {c.name} <sup>{c.post_count}</sup>
              </NavLink>
            ))}
          </nav>
        )}

        {unknownCategory ? (
          <StatusMessage error={{ response: { status: 404 } }} backTo="/blog" backLabel="Tüm yazılar" />
        ) : (
          <StatusMessage
            loading={loading}
            error={error}
            empty={posts && posts.length === 0}
            emptyText={
              category
                ? `"${category.name}" kategorisinde henüz yazı yok. Çok yakında…`
                : "İlk yazı çok yakında."
            }
          />
        )}

        {!unknownCategory && featured && (
          <article className="featured-post" data-reveal key={`f-${featured.slug}`}>
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
              <PostMeta post={featured} showCategory={!category} />
              <h2 className="featured-title">
                <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <PostWork post={featured} />
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

        {!unknownCategory && rest.length > 0 && (
          <>
            <div className="archive-divider" aria-hidden="true">
              <span>Önceki yazılar</span>
            </div>

            <div className="post-grid">
              {rest.map((post) => (
                <article className="post-card" key={post.slug} data-reveal>
                  <PostArt post={post} />
                  <div className="post-card-body">
                    <PostMeta post={post} showCategory={!category} />
                    <h3 className="post-card-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <PostWork post={post} />
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
