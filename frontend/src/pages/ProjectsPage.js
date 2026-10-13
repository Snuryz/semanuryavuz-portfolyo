import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import useReveal from "../hooks/useReveal";
import StatusMessage from "../components/StatusMessage";
import ScreenshotCascade from "../components/ScreenshotCascade";
import { pad } from "../utils/format";
import "../styles/pages.css";
import "./projectsPage.css";

const ProjectsPage = () => {
  const { data: projects, loading, error } = useApi("/projects/");
  const visible = useMemo(() => projects || [], [projects]);

  const techCount = useMemo(
    () => new Set(visible.flatMap((p) => p.tags)).size,
    [visible]
  );

  const listRef = useReveal([visible.length]);

  return (
    <div className="page page--projects">
      <div className="page-inner">
        <header className="section-head works-head">
          <span className="section-eyebrow">Koleksiyon</span>
          <h1 className="section-title">Tüm Projelerim</h1>
          <p className="section-lede">
            Üzerinde çalıştığım her şey, bir arada. Bir projeye tıklayarak
            hikâyesini okuyabilirsiniz.
          </p>
          {projects && projects.length > 0 && (
            <p className="works-count">
              <span>{pad(projects.length)}</span> proje
              <span className="works-count-star" aria-hidden="true">✦</span>
              <span>{pad(techCount)}</span> teknoloji
            </p>
          )}
        </header>

        <StatusMessage
          loading={loading}
          error={error}
          empty={projects && projects.length === 0}
          emptyText="Henüz eklenmiş bir proje yok."
        />

        <div className="works" ref={listRef}>
          {visible.map((project, idx) => (
            <article
              className={`work${idx % 2 ? " work--reverse" : ""}`}
              key={project.slug}
              data-reveal
            >
              <Link
                to={`/projects/${project.slug}`}
                className="work-media"
                aria-label={`${project.title} projesini incele`}
              >
                {project.image ? (
                  <ScreenshotCascade src={project.image} reverse={idx % 2 === 1} />
                ) : (
                  <span className="work-placeholder" aria-hidden="true">✦</span>
                )}
              </Link>

              <div className="work-info">
                <span className="work-no" aria-hidden="true">
                  {pad(idx + 1)}
                </span>
                <span className="work-meta">
                  {project.year ? `${project.year} · ` : ""}
                  {project.tags[0] || "Proje"}
                </span>
                <h2 className="work-title">
                  <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <p className="work-summary">{project.summary}</p>

                {project.tags.length > 0 && (
                  <ul className="work-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}

                <div className="work-actions">
                  <Link to={`/projects/${project.slug}`} className="work-cta">
                    Projeyi incele <span aria-hidden="true">&#8594;</span>
                  </Link>
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      className="work-ext"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Canlı site <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      className="work-ext"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kod <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {visible.length > 0 && (
          <div className="works-end">
            <span aria-hidden="true">✦</span>
            <p>Yeni bir proje için birlikte çalışmak ister misiniz?</p>
            <Link to="/#contact" className="ghost-link">
              Benimle iletişime geçin <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
