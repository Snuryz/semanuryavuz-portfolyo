import { useEffect, useRef } from "react";

/**
 * [data-reveal] öğeleri ekrana girince (ya da hızlı kaydırmayla üstünden
 * geçilince) data-shown="true" alır; CSS bu öznitelikle belirişi oynatır.
 * Sınıf yerine ayrı bir öznitelik kullanılır ki React yeniden çizince silinmesin.
 * deps değişince (ör. filtre) yeni öğeler de kontrol edilir.
 */
const useReveal = (deps = []) => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;

    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.9;
      root.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.dataset.shown = "true";
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};

export default useReveal;
