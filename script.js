const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  toggle.classList.remove("active");
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
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

const galleryTrack = document.getElementById("galleryTrack");
const galleryItems = document.querySelectorAll(".gallery-item");
let currentIndex = 0;

function centerImage(index) {
  const item = galleryItems[index];
  if (!item) return;

  const itemLeft = item.offsetLeft;
  const itemWidth = item.offsetWidth;
  const trackWidth = galleryTrack.offsetWidth;

  const scrollTo = itemLeft - trackWidth / 2 + itemWidth / 2;
  galleryTrack.scrollTo({ left: scrollTo, behavior: "smooth" });

  // Atualiza destaque visual
  galleryItems.forEach((i) => i.classList.remove("active"));
  item.classList.add("active");
}

function scrollGallery(direction) {
  currentIndex += direction;

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= galleryItems.length)
    currentIndex = galleryItems.length - 1;

  centerImage(currentIndex);
}

window.addEventListener("load", () => {
  centerImage(currentIndex);
});

galleryTrack.addEventListener("scroll", () => {
  // Debounce visual highlight (sem scroll automático)
  window.requestAnimationFrame(() => {
    let center = galleryTrack.scrollLeft + galleryTrack.offsetWidth / 2;
    let closestItem = null;
    let closestDistance = Infinity;

    galleryItems.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(center - itemCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
        currentIndex = index;
      }
    });

    galleryItems.forEach((i) => i.classList.remove("active"));
    if (closestItem) closestItem.classList.add("active");
  });
});
