import React, { useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import StatusMessage from "../components/StatusMessage";
import { pad } from "../utils/format";
import "./projects.css";

const Projects = () => {
  const { data: projects, loading, error } = useApi("/projects/?featured=1");
  const [active, setActive] = useState(0);
  // Her görselin en/boy oranı; pencere aktif görselin şekline uyar
  const [ratios, setRatios] = useState({});
  const hasProjects = projects && projects.length > 0;
  const activeRatio = hasProjects ? ratios[projects[active]?.slug] : undefined;
  // Yatay görsel kendi oranında tam görünür; uzun dikey görsel 4:5 pencerede üstten gösterilir
  const windowRatio = activeRatio && activeRatio > 0.8 ? activeRatio : 0.8;

  return (
    <section className="projects-container" id="projects">
      <div className="projects-content">
        <header className="section-head">
          <span className="section-eyebrow">Çalışmalar</span>
          <h2 className="section-title">Projelerim</h2>
          <p className="section-lede">
            Fikirden ekrana uzanan yolculuklar. Bir projenin üzerine gelerek
            yakından inceleyin.
          </p>
        </header>

        <StatusMessage
          loading={loading}
          error={error}
          empty={projects && !hasProjects}
          emptyText="Yakında burada yeni projeler olacak."
        />

        {hasProjects && (
          <div className="showcase">
            <div className="showcase-preview" aria-hidden="true">
              <div className="preview-window" style={{ aspectRatio: windowRatio }}>
                {projects.map((project, idx) =>
                  project.image ? (
                    <img
                      key={project.slug}
                      src={project.image}
                      alt=""
                      className={`preview-img${idx === active ? " is-active" : ""}`}
                      onLoad={(e) => {
                        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                        if (w && h) setRatios((r) => ({ ...r, [project.slug]: w / h }));
                      }}
                    />
                  ) : null
                )}
              </div>
              <div className="preview-counter">
                <span className="counter-current">{pad(active + 1)}</span>
                <span className="counter-line" />
                <span>{pad(projects.length)}</span>
              </div>
            </div>

            <ol className="showcase-list">
              {projects.map((project, idx) => {
                const isActive = idx === active;
                return (
                  <li
                    key={project.slug}
                    className={`showcase-item${isActive ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                  >
                    <button
                      type="button"
                      className="item-head"
                      onClick={() => setActive(idx)}
                      onFocus={() => setActive(idx)}
                      aria-expanded={isActive}
                    >
                      <span className="item-no">{pad(idx + 1)}</span>
                      <span className="item-title">{project.title}</span>
                      <span className="item-mark" aria-hidden="true" />
                    </button>

                    <div className="item-body">
                      <div className="item-body-inner">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={`${project.title} ekran görüntüsü`}
                            className="item-thumb"
                          />
                        )}
                        <p>{project.summary}</p>
                        <ul className="item-tags">
                          {project.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                        <Link to={`/projects/${project.slug}`} className="item-link">
                          Projeyi incele <span aria-hidden="true">&#8594;</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <Link to="/projects" className="ghost-link">
          Tüm projeler <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
