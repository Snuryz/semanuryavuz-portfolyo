import React from "react";
import { Link } from "react-router-dom";
import { formatDate, toRoman } from "../utils/format";
import "../pages/blog.css";

/** Blog yazılarını günce düzeninde listeler (ana sayfa ve blog sayfası ortak). */
const JournalList = ({ posts }) => (
  <div className="journal">
    {posts.map((post, idx) => (
      <article className="entry" key={post.slug}>
        <span className="entry-no" aria-hidden="true">
          {toRoman(idx + 1)}
        </span>
        <div className="entry-body">
          <span className="entry-category">
            {post.category && <>{post.category.name} · </>}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </span>
          <h3 className="entry-title">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="entry-excerpt">{post.excerpt}</p>
        </div>
        <span className="entry-link" aria-hidden="true">
          {post.reading_minutes} dk okuma <span>&#8594;</span>
        </span>
      </article>
    ))}
  </div>
);

export default JournalList;
