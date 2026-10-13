const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

let activeAnimation = 0;

/**
 * Sayfayı yumuşak bir yavaşlamayla (easeOutQuart) hedefe kaydırır.
 * getTarget her karede yeniden okunur; kaydırma sırasında görsel/yazı tipi
 * yüklenip bölümler yer değiştirse bile doğru yerde durulur.
 */
const animateTo = (getTarget, duration = 1200) => {
  const id = ++activeAnimation;
  if (prefersReducedMotion()) {
    window.scrollTo(0, getTarget());
    return;
  }
  const start = window.scrollY;
  const startTime = performance.now();

  const step = (now) => {
    if (id !== activeAnimation) return; // yeni bir kaydırma başladıysa bunu bırak
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    window.scrollTo(0, start + (getTarget() - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

export const smoothScrollTo = (target, duration) => animateTo(() => target, duration);

// Bölüm başlığı ekranın tepesine yapışmasın diye üstte bırakılan boşluk
const HEADING_GAP = 56;

/**
 * id'si verilen bölümün başlığına kaydırır (bölümlerin üstündeki dekoratif
 * boşlukları atlar); bölüm sayfada yoksa false döner.
 */
export const scrollToSection = (id, duration) => {
  const section = document.getElementById(id);
  if (!section) return false;
  const target = section.querySelector(".section-head, .contact-inner") || section;
  animateTo(() => {
    const top = target.getBoundingClientRect().top + window.scrollY - HEADING_GAP;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    return Math.max(top, sectionTop);
  }, duration);
  return true;
};
