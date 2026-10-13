import React, { useEffect, useRef } from "react";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";
import Blog from "./Blog";
import "./home.css";
import "./about.css";
import "./contact.css";
import "./blog.css";

const Home = () => {
  const homeRef = useRef(null);
  const videoRef = useRef(null);

  // Giriş bölümü ekrandan çıkınca videoyu durdur, geri gelince devam ettir
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!homeRef.current) return;
      if (window.scrollY > 0) {
        homeRef.current.classList.add("scrolled");
      } else {
        homeRef.current.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="home-container" ref={homeRef}>
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={require("../assets/hero-poster.jpg")}
          src={require("../assets/hero.mp4")}
        />
        <div className="portfolio-title">
          <span className="hero-eyebrow">Portfolyo</span>
          <h1>Sema Nur Yavuz</h1>
          <div className="hero-rule" aria-hidden="true">
            ✦
          </div>
        </div>
      </div>
      <div className="home-item-one"></div>
      <About />
      <Projects />
      <Blog />
      <Contact />
    </>
  );
};

export default Home;
