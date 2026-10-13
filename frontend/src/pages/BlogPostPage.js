import React from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import usePageMeta from "../hooks/usePageMeta";
import RichText from "../components/RichText";
import WorkInfo from "../components/WorkInfo";
import StatusMessage from "../components/StatusMessage";
import { formatDate } from "../utils/format";
import "../styles/pages.css";
import "./blogPost.css";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post, loading, error } = useApi(`/posts/${slug}/`);
  usePageMeta(post?.title, post?.excerpt);

  return (
    <div className="page page--blog page--reading">
      <div className="page-inner page-inner--narrow">
        <Link to="/blog" className="back-link">
          <span aria-hidden="true">&#8592;</span> Tüm yazılar
        </Link>

        <StatusMessage loading={loading} error={error} backTo="/blog" backLabel="Bloga dön" />

        {post && (
          <article className="post">
            <header className="post-head">
              {post.category && (
                <Link to={`/blog/kategori/${post.category.slug}`} className="section-eyebrow post-category-link">
                  {post.category.name}
                </Link>
              )}
              <h1 className="section-title">{post.title}</h1>
              <p className="post-meta">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span aria-hidden="true">✦</span>
                {post.reading_minutes} dk okuma
              </p>
            </header>

            {post.work_title ? (
              <WorkInfo post={post} />
            ) : (
              post.cover && (
                <figure className="post-cover">
                  <img src={post.cover} alt="" />
                </figure>
              )
            )}

            <RichText text={post.content} className="post-body" />

            <footer className="post-footer">
              <span className="post-footer-star" aria-hidden="true">
                ✦
              </span>
              <Link to="/blog" className="ghost-link">
                Diğer yazılar <span aria-hidden="true">&#8594;</span>
              </Link>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
