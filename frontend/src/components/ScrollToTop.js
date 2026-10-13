import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../utils/scroll";

/** Sayfa değişince en üste çıkar; adreste #bölüm varsa oraya yumuşakça kayar. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hash) return;
    // Yeni sayfa çizildikten sonra hedef bölüme kay
    const timer = setTimeout(() => scrollToSection(hash.slice(1)), 150);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
