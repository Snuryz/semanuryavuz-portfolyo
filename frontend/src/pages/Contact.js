import React, { useState } from "react";
import api from "../api";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "../siteConfig";
import "./contact.css";


const initialForm = { name: "", email: "", subject: "", message: "" };

const STATUS_TEXT = {
  idle: "Tüm alanlar özenle okunur.",
  sending: "Gönderiliyor…",
  sent: "Teşekkürler! Mesajınız bana ulaştı.",
  throttled: "Kısa sürede çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin.",
  error: "Mesaj gönderilemedi. Lütfen tekrar deneyin ya da e-posta ile yazın.",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setFieldErrors({});
    try {
      await api.post("/contact/", form);
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      const res = err.response;
      if (res?.status === 400) {
        setFieldErrors(res.data);
        setStatus("idle");
      } else {
        setStatus(res?.status === 429 ? "throttled" : "error");
      }
    }
  };

  const fieldError = (name) =>
    fieldErrors[name] && <em className="letter-error">{fieldErrors[name][0]}</em>;

  return (
    <section className="contact-container" id="contact">
      <div className="contact-inner">
        <div className="contact-intro">
          <h2 className="section-title">İletişim</h2>
          <p className="section-lede">
            Bir proje fikri, bir işbirliği ya da yalnızca bir merhaba...
            Kaleminizden çıkan her satırı okumaktan mutluluk duyarım.
          </p>

          <ul className="contact-details">
            <li>
              <span className="detail-label">E-posta</span>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            {SOCIAL_LINKS.map((link) => (
              <li key={link.url}>
                <span className="detail-label">{link.label}</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="letter" onSubmit={handleSubmit}>
          <p className="letter-salutation">Sevgili Sema,</p>

          <div className="letter-row">
            <label className="letter-field">
              <span>Adınız</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
              {fieldError("name")}
            </label>
            <label className="letter-field">
              <span>E-posta</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {fieldError("email")}
            </label>
          </div>

          <label className="letter-field">
            <span>Konu</span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              maxLength={200}
            />
            {fieldError("subject")}
          </label>

          <label className="letter-field">
            <span>Mesajınız</span>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              maxLength={5000}
              required
            />
            {fieldError("message")}
          </label>

          <div className="letter-footer">
            <p
              className={`letter-status letter-status--${status}`}
              role="status"
            >
              {STATUS_TEXT[status]}
            </p>
            <button
              type="submit"
              className="seal-button"
              disabled={status === "sending"}
            >
              <span className="seal" aria-hidden="true">
                S
              </span>
              Gönder
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
