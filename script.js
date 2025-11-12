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

// Carrossel automático
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showNextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

// Troca a cada 5 segundos
setInterval(showNextSlide, 5000);

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

// JavaScript (cole no final do body ou em arquivo JS)
(function () {
  const track = document.getElementById("carouselTrack");
  const dotsContainer = document.getElementById("carouselDots");
  let items = Array.from(track.children);
  let itemsPerView =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--items-per-view"
      )
    ) || 3;

  // recalcula itemsPerView conforme breakpoint
  function detectItemsPerView() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  // configura largura dos itens (em pixels) e aplica clones para loop infinito
  let slideWidth = 0;
  let index = 0; // índice lógico do slide atual (0 .. stepCount-1)
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 3000;
  let isDragging = false,
    startX = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0;

  function setup() {
    // limpa clones anteriores (se houver)
    track.querySelectorAll(".clone").forEach((n) => n.remove());
    items = Array.from(track.children);
    itemsPerView = detectItemsPerView();

    // cria clones (n = itemsPerView) para loop infinito
    const firstClones = items
      .slice(0, itemsPerView)
      .map((n) => n.cloneNode(true));
    const lastClones = items.slice(-itemsPerView).map((n) => n.cloneNode(true));
    firstClones.forEach((n) => {
      n.classList.add("clone");
      track.appendChild(n);
    });
    lastClones.reverse().forEach((n) => {
      n.classList.add("clone");
      track.insertBefore(n, track.firstChild);
    });

    // recalc items array
    items = Array.from(track.children);
    // definir largura de cada item em JS para evitar bug de cálculo
    slideWidth = track.parentElement.clientWidth / itemsPerView;
    items.forEach((item) => {
      item.style.width = slideWidth + "px";
    });

    // set index para o primeiro "real" (depois dos clones)
    index = itemsPerView;
    updatePosition(false);

    buildDots();
    resetAutoplay();
  }

  function buildDots() {
    dotsContainer.innerHTML = "";
    // numero de steps = número de "painéis" logicos = originalItemsLength / 1 step = originalCount - (itemsPerView -1)
    const originalCount =
      document.querySelectorAll("#carouselTrack .gallery-item").length - 0; // before clones, but we currently have clones; calculate alternative:
    // Simpler: count unique slides by reading src attributes of non-clone nodes before we added clones.
    // We'll compute stepCount as originalCount - itemsPerView + 1 (quantos passos completos existem)
    // To get original items, filter clones out:
    const realItems = items.filter((i) => !i.classList.contains("clone"));
    const stepCount = Math.max(1, realItems.length - (itemsPerView - 1));
    for (let i = 0; i < stepCount; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
      dot.addEventListener("click", () => {
        // ínicio lógico: position = itemsPerView + i
        index = itemsPerView + i;
        updatePosition(true);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    if (!dots.length) return;
    // calcula posição lógica atual: converte index numa posição entre 0..stepCount-1
    const realItems = items.filter((i) => !i.classList.contains("clone"));
    const stepCount = Math.max(1, realItems.length - (itemsPerView - 1));
    // compute logicalIndex
    let logicalIndex = index - itemsPerView;
    // clamp and wrap
    if (logicalIndex < 0)
      logicalIndex = ((logicalIndex % stepCount) + stepCount) % stepCount;
    logicalIndex = logicalIndex % stepCount;
    dots.forEach((d, i) => d.classList.toggle("active", i === logicalIndex));
  }

  function updatePosition(animate = true) {
    if (!animate) track.style.transition = "none";
    else track.style.transition = "transform 450ms cubic-bezier(.22,.9,.32,1)";
    const translateX = -index * slideWidth;
    track.style.transform = `translateX(${translateX}px)`;
    currentTranslate = translateX;
    prevTranslate = translateX;
    if (!animate) {
      // força repaint antes de reativar transition
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
    // depois de animar, checar clones para loop
    setTimeout(checkLoopFix, 480);
    updateDots();
  }

  function checkLoopFix() {
    // se estamos num clone do início (index >= itens.length - itemsPerView) ou clone do fim (index < itemsPerView)
    const total = items.length;
    if (index >= total - itemsPerView) {
      // mover para o mesmo conteúdo real no começo
      index = itemsPerView;
      updatePosition(false);
    } else if (index < itemsPerView) {
      // mover para final equivalente
      index = total - itemsPerView * 2;
      updatePosition(false);
    }
  }

  // autoplay
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      index++;
      updatePosition(true);
    }, AUTOPLAY_DELAY);
  }

  // pausa quando hover/focus
  function pauseAutoplay() {
    clearInterval(autoplayTimer);
  }

  // drag / touch handling
  function pointerDown(clientX) {
    isDragging = true;
    startX = clientX;
    track.style.transition = "none";
    pauseAutoplay();
  }
  function pointerMove(clientX) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const translate = prevTranslate + dx;
    track.style.transform = `translateX(${translate}px)`;
    currentTranslate = translate;
  }
  function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    const moved = currentTranslate - prevTranslate;
    // se moveu mais que 30% do slideWidth, muda slide
    if (Math.abs(moved) > slideWidth * 0.3) {
      if (moved < 0) index++;
      else index--;
    }
    updatePosition(true);
    prevTranslate = -index * slideWidth;
    resetAutoplay();
  }

  // listeners de mouse/touch
  track.addEventListener("mousedown", (e) => {
    e.preventDefault();
    pointerDown(e.clientX);
  });
  window.addEventListener("mousemove", (e) => {
    pointerMove(e.clientX);
  });
  window.addEventListener("mouseup", () => {
    pointerUp();
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      pointerDown(e.touches[0].clientX);
    },
    { passive: true }
  );
  track.addEventListener(
    "touchmove",
    (e) => {
      pointerMove(e.touches[0].clientX);
    },
    { passive: true }
  );
  track.addEventListener("touchend", () => {
    pointerUp();
  });

  // pausar autoplay quando cursor/foco dentro da viewport
  const viewport = track.parentElement;
  viewport.addEventListener("mouseenter", pauseAutoplay);
  viewport.addEventListener("mouseleave", resetAutoplay);
  viewport.addEventListener("focusin", pauseAutoplay);
  viewport.addEventListener("focusout", resetAutoplay);

  // reconstrói no resize
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });

  // inicia
  setup();

  // acessibilidade: keyboard (setas)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      index++;
      updatePosition(true);
      resetAutoplay();
    }
    if (e.key === "ArrowLeft") {
      index--;
      updatePosition(true);
      resetAutoplay();
    }
  });
})();
