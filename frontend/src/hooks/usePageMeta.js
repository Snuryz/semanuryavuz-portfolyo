import { useEffect } from "react";

const SITE_NAME = "Sema Nur Yavuz";
const DEFAULT_TITLE = "Sema Nur Yavuz | Portfolyo";
const DEFAULT_DESCRIPTION = "Sema Nur Yavuz — yazılım projeleri, tasarımlar ve blog yazıları.";

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Sayfanın sekme başlığını ve açıklamasını ayarlar; sayfadan çıkınca varsayılana döner. */
const usePageMeta = (title, description) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('link[rel="canonical"]', "href", window.location.origin + window.location.pathname);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "content", DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "content", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
};

export default usePageMeta;
