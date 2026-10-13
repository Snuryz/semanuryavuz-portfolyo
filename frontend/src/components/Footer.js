import React from "react";
import { CONTACT_EMAIL, OWNER_NAME, SOCIAL_LINKS } from "../siteConfig";
import "./footer.css";

const Footer = () => (
  <footer className="vintage-footer">
    <div className="footer-content">
      <span className="footer-title">
        © {new Date().getFullYear()} | {OWNER_NAME}
      </span>
      <span className="footer-sep">•</span>
      <span className="footer-social">
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        {SOCIAL_LINKS.map((link) => (
          <React.Fragment key={link.url}>
            {" | "}
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </React.Fragment>
        ))}
      </span>
    </div>
  </footer>
);

export default Footer;
