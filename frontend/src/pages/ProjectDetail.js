import React from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import usePageMeta from "../hooks/usePageMeta";
import RichText from "../components/RichText";
import StatusMessage from "../components/StatusMessage";
import "../styles/pages.css";
import "./projectDetails.css";

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, loading, error } = useApi(`/projects/${slug}/`);
  usePageMeta(project?.title, project?.summary);

  return (
    <div className="page page--projects">
      <div className="page-inner">
        <Link to="/projects" className="back-link">
          <span aria-hidden="true">&#8592;</span> Tüm projeler
        </Link>

        <StatusMessage
          loading={loading}
          error={error}
          backTo="/projects"
          backLabel="Projelere dön"
        />

        {project && (
          <article className="project-detail">
            <header className="project-detail-head">
              <span className="section-eyebrow">
                Proje{project.year && <> · {project.year}</>}
              </span>
              <h1 className="section-title">{project.title}</h1>
              <p className="section-lede">{project.summary}</p>

              {project.tags.length > 0 && (
                <ul className="item-tags project-detail-tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}

              {(project.live_url || project.repo_url) && (
                <div className="project-detail-actions">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      className="ghost-link ghost-link--solid"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Canlı siteyi gör <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      className="ghost-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kaynak kod <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                </div>
              )}
            </header>

            {project.image && (
              <figure className="project-detail-figure">
                <div className="project-detail-window" tabIndex={0}>
                  <img src={project.image} alt={`${project.title} ekran görüntüsü`} />
                </div>
                <figcaption>Görseli kaydırarak sayfanın tamamını inceleyebilirsiniz.</figcaption>
              </figure>
            )}

            {project.description && (
              <RichText text={project.description} className="project-detail-text" />
            )}

            {(project.previous || project.next) && (
              <nav className="project-pager" aria-label="Diğer projeler">
                {project.previous ? (
                  <Link to={`/projects/${project.previous.slug}`} className="pager-link">
                    <span className="pager-label">&#8592; Önceki proje</span>
                    <span className="pager-title">{project.previous.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {project.next && (
                  <Link
                    to={`/projects/${project.next.slug}`}
                    className="pager-link pager-link--next"
                  >
                    <span className="pager-label">Sonraki proje &#8594;</span>
                    <span className="pager-title">{project.next.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
