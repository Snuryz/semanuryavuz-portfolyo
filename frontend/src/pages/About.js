import React from "react";
import "./about.css";

const About = () => (
  <section className="about-container" id="about">
    <div className="about-content">
      <header className="section-head about-head">
        <span className="section-eyebrow">Tanışalım</span>
        <h2 className="section-title">Hakkımda</h2>
      </header>

      <p className="about-lead">
        Merhaba, ben 2 senesini yazılım dünyasını tanımak,
        yaklaşık 6 senesini ise bu dünyada bir şeyler üretmek için harcamış,
        özgünlüğü ve anlamlı işler yapmayı kendine pusula edinmiş biriyim.
      </p>

      <div className="about-divider" aria-hidden="true">
        ✦
      </div>

      <div className="about-body">
        <p className="about-dropcap">
          Hayata tek bir açıdan bakmam. Bana göre gerçek bilgi bir
          puzzeldır; yalnızca parçalara ayrılmış ve hayatın farklı köşelerine
          dağılmıştır. Bir yazılımın mantığında, bir
          kitabın satırlarında, bir milletin tarihinde
          bulunup keşfedilebilir. Bu yüzden merakım hiçbir zaman tek bir alanla sınırlı kalmadı; yazılımdan
          sanata, tarihten tasarıma kadar aklınıza gelebilecek pek çok konuda
          okumuş, araştırmış ve denemişimdir.
        </p>
        <p>
          Öğrendiğim her yeni şeyi, bilgi puzzelında ait olduğu yere
          yerleştiririm. Parçalar birleştikçe birbirine en uzak görünen
          alanların bile aslında aynı özü konuştuğunu fark ederim: Matematik ile
          müzik,tarih ile yazılım, geçmiş ile gelecek. Zıt görünen şeylerin
          arasındaki bu benzerlikleri yakalamak, hayatta en iyi yaptığım iştir diyebiirim.
        </p>
        <p>
          Tasarımlarımda ve projelerimde yapmaya çalıştığım şey de budur:
          Birbirinden kopuk duran parçaları bir araya getirip insanlara bütünü
          göstermek. Bu yüzden her biri benden kopmuş, kendine özgü bir parça
          taşır. Beni daha yakından tanımak isterseniz sayfayı aşağı kaydırarak
          projelerime göz atabilirsiniz.
        </p>
      </div>

      <p className="about-signature">Sema Nur Yavuz</p>
    </div>
  </section>
);

export default About;
