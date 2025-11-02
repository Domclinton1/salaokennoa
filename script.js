// ===== MENU MOBILE =====
const toggle = document.getElementById("menu-toggle");
const overlay = document.getElementById("overlay");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  overlay.classList.toggle("active");
});

// Fecha o overlay ao clicar em um link
document.querySelectorAll(".overlay-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    toggle.classList.remove("active");
    overlay.classList.remove("active");
  });
});

// ✨ Efeito suave de entrada do texto
window.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".fade-in");
  setTimeout(() => content.classList.add("visible"), 400);
});

// 🎯 Controle de abertura e fechamento das perguntas
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

// 🎠 Carrossel estilo Netflix
const track = document.querySelector(".carousel-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
const cardWidth = 320; // Largura de cada card + margem

nextBtn.addEventListener("click", () => {
  const maxIndex =
    track.children.length -
    Math.floor(track.parentElement.offsetWidth / cardWidth);
  if (index < maxIndex) index++;
  track.style.transform = `translateX(-${index * cardWidth}px)`;
});

prevBtn.addEventListener("click", () => {
  if (index > 0) index--;
  track.style.transform = `translateX(-${index * cardWidth}px)`;
});

// Animação suave ao rolar a página (fade-in)
document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".about-content");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutSection.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(aboutSection);
});

// Efeito de aparição suave
const style = document.createElement("style");
style.textContent = `
  .about-content {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
  }
  .about-content.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
