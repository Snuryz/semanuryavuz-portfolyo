import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import JournalList from "../components/JournalList";
import StatusMessage from "../components/StatusMessage";
import "./blog.css";

const Blog = () => {
  const { data: posts, loading, error } = useApi("/posts/?limit=3");

  return (
    <section className="blog-container" id="blog">
      <header className="section-head">
        <span className="section-eyebrow">Günce</span>
        <h2 className="section-title">Blog Yazılarım</h2>
        <p className="section-lede">
          Öğrendiklerimi, düşündüklerimi ve üretirken biriktirdiklerimi
          kaleme aldığım sayfalar.
        </p>
      </header>

      <StatusMessage
        loading={loading}
        error={error}
        empty={posts && posts.length === 0}
        emptyText="İlk yazı çok yakında."
      />
      {posts && posts.length > 0 && <JournalList posts={posts} />}

      <div className="blog-more-wrap">
        <Link to="/blog" className="ghost-link">
          Tüm yazılar <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>
    </section>
  );
};

export default Blog;
