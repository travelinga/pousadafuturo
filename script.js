```javascript
/*
  POUSADA FUTURO — CONSULTA DE DATAS E PREÇOS
  Os preços são referências iniciais por diária.
  O valor final e a disponibilidade são confirmados pela pousada.
*/

const CONFIG = {
  nome: "Pousada Futuro",
  cidade: "Ubatuba - SP",
  whatsapp: "5515981689760",

  quartos: {
    "Bangalô": 550,
    "Quarto Varanda": 140,
    "Quarto Casal": 160,
    "Quarto Família": 300
  }
};

/* =========================================
   WHATSAPP
========================================= */

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

/* =========================================
   FORMATAÇÃO DE DATAS E VALORES
========================================= */

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
  }).format(value);
}

/* =========================================
   DATAS DA HOSPEDAGEM
========================================= */

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const localToday = getLocalDateString();

/* =========================================
   MENU MOBILE
========================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );

    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      menuToggle.textContent = "☰";
    });
  });
}

/* =========================================
   GALERIAS DAS ACOMODAÇÕES
========================================= */

document.querySelectorAll("[data-gallery]").forEach(gallery => {
  const mainImage = gallery.querySelector(".room-gallery-main");

  gallery.querySelectorAll(".room-thumb").forEach(button => {
    button.addEventListener("click", () => {
      const image = button.dataset.image;

      if (!image || !mainImage) return;

      mainImage.src = image;

      gallery.querySelectorAll(".room-thumb").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });
});

/* =========================================
   FORMULÁRIOS INDIVIDUAIS DOS QUARTOS
========================================= */

document.querySelectorAll("[data-room-booking]").forEach(form => {
  const checkinField = form.querySelector("[data-checkin
