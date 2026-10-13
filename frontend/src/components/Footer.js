import React from "react";
import "./footer.css";

const Footer = () => (
  <footer className="vintage-footer">
    <div className="footer-content">
      <span className="footer-title">© 2025 | Portfolyo</span>
      <span className="footer-sep">•</span>
      <span className="footer-social">
        <a href="mailto:mail@site.com">mail@site.com</a> | 
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
      </span>
    </div>
  </footer>
);

export default Footer;
