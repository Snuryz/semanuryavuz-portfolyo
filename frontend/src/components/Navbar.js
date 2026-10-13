import './navbar.css';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection, smoothScrollTo } from '../utils/scroll';

// Ana sayfadaki bölümler (id -> menü adı)
const LINKS = [
  { id: 'top', label: 'Portal' },
  { id: 'about', label: 'Hakkımda' },
  { id: 'projects', label: 'Projelerim' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'İletişim' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (e, id) => {
    e.preventDefault();
    // Başka bir sayfadaysak önce ana sayfaya geç; kaydırmayı ScrollToTop yapar
    if (pathname !== '/') {
      navigate(id === 'top' ? '/' : `/#${id}`);
      return;
    }
    if (id === 'top') {
      smoothScrollTo(0);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <nav className="arcane-navbar">
      <ul>
        {LINKS.map(({ id, label }) => (
          <li key={id}>
            <a href={id === 'top' ? '/' : `/#${id}`} onClick={(e) => handleClick(e, id)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
