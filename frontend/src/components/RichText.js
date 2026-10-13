import React from "react";
import "./richtext.css";

/**
 * Admin panelinde yazılan düz metni biçimlendirir (HTML çalıştırmadan, güvenli):
 *   boş satır      -> yeni paragraf
 *   "## " / "### " -> ara başlık
 *   "> "           -> alıntı
 *   "- "           -> madde listesi
 *   ``` ... ```    -> kod bloğu
 */
const parseBlocks = (text) => {
  const blocks = [];
  const lines = (text || "").replace(/\r\n/g, "\n").split("\n");
  let paragraph = [];
  let list = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    if (list) blocks.push({ type: "ul", items: list });
    paragraph = [];
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", text: code.join("\n") });
    } else if (!trimmed) {
      flush();
    } else if (trimmed.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else if (trimmed.startsWith("> ")) {
      flush();
      blocks.push({ type: "quote", text: trimmed.slice(2) });
    } else if (trimmed.startsWith("- ")) {
      if (paragraph.length) {
        blocks.push({ type: "p", text: paragraph.join(" ") });
        paragraph = [];
      }
      list = list || [];
      list.push(trimmed.slice(2));
    } else {
      if (list) flush();
      paragraph.push(trimmed);
    }
  }
  flush();
  return blocks;
};

const RichText = ({ text, className = "" }) => (
  <div className={`rich-text ${className}`}>
    {parseBlocks(text).map((block, idx) => {
      switch (block.type) {
        case "h2":
          return <h2 key={idx}>{block.text}</h2>;
        case "h3":
          return <h3 key={idx}>{block.text}</h3>;
        case "quote":
          return <blockquote key={idx}>{block.text}</blockquote>;
        case "code":
          return (
            <pre key={idx}>
              <code>{block.text}</code>
            </pre>
          );
        case "ul":
          return (
            <ul key={idx}>
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        default:
          return <p key={idx}>{block.text}</p>;
      }
    })}
  </div>
);

export default RichText;
