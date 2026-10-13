import React from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import RichText from "../components/RichText";
import StatusMessage from "../components/StatusMessage";
import { formatDate } from "../utils/format";
import "../styles/pages.css";
import "./blogPost.css";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post, loading, error } = useApi(`/posts/${slug}/`);

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
              {post.category && <span className="section-eyebrow">{post.category}</span>}
              <h1 className="section-title">{post.title}</h1>
              <p className="post-meta">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span aria-hidden="true">✦</span>
                {post.reading_minutes} dk okuma
              </p>
            </header>

            {post.cover && (
              <figure className="post-cover">
                <img src={post.cover} alt="" />
              </figure>
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
