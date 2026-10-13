import './navbar.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection, smoothScrollTo } from '../utils/scroll';

// Ana sayfadaki bölümler (id -> menü adı)
const LINKS = [
  { id: 'top', label: 'Ana Sayfa' },
  { id: 'about', label: 'Hakkımda' },
  { id: 'projects', label: 'Projelerim' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'İletişim' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Sayfa aşağı kayınca menü ekranın üstüne yapışır ve yarı saydam olur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <nav className={`arcane-navbar${scrolled ? ' is-scrolled' : ''}`}>
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
