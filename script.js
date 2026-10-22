
/*
=========================================
 POUSADA FUTURO — CONFIGURAÇÕES
 Todas as imagens ficam na raiz do projeto.
=========================================

Para editar o WhatsApp, informe:
55 + DDD + número, somente números.

Exemplo: 5515999999999
*/

const CONFIG = {
  nome: "Pousada Futuro",
  cidade: "Ubatuba - SP",
  whatsapp: "5515981689760",

  endereco: "Adicione o endereço completo da pousada aqui",

  quartos: {
    "Bangalô": "Consulte",
    "Quarto Varanda": "Consulte",
    "Quarto Casal": "Consulte",
    "Quarto Família": "Consulte"
  },

  mapaUrl: ""
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
   DATAS
========================================= */

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================
   MENU PARA CELULAR
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
   GALERIA DOS QUARTOS
   Clicar numa miniatura troca a foto principal.
========================================= */

document.querySelectorAll(".room-card").forEach(card => {
  const mainPhoto = card.querySelector(".room-main-photo");
  const thumbnails = card.querySelectorAll(".room-thumbnails img");

  if (!mainPhoto || thumbnails.length === 0) return;

  thumbnails.forEach(thumbnail => {
    thumbnail.setAttribute("tabindex", "0");
    thumbnail.setAttribute("role", "button");

    if (thumbnail.alt) {
      thumbnail.setAttribute(
        "aria-label",
        `Ver foto: ${thumbnail.alt}`
      );
    }

    function selectPhoto() {
      const newSource = thumbnail.getAttribute("src");

      if (!newSource) return;

      mainPhoto.setAttribute("src", newSource);

      if (thumbnail.alt) {
        mainPhoto.setAttribute("alt", thumbnail.alt);
      }

      thumbnails.forEach(image => {
        image.style.outline = "none";
        image.removeAttribute("aria-current");
      });

      thumbnail.style.outline = "3px solid #087e8b";
      thumbnail.style.outlineOffset = "-3px";
      thumbnail.setAttribute("aria-current", "true");
    }

    thumbnail.addEventListener("click", selectPhoto);

    thumbnail.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPhoto();
      }
    });
  });

  // Destaca a primeira miniatura, correspondente à foto inicial.
  if (thumbnails[0]) {
    thumbnails[0].style.outline = "3px solid #087e8b";
    thumbnails[0].style.outlineOffset = "-3px";
    thumbnails[0].setAttribute("aria-current", "true");
  }
});

/* =========================================
   PREÇOS DAS ACOMODAÇÕES
========================================= */

document.querySelectorAll(".room-card").forEach(card => {
  const title = card.querySelector("h3")?.textContent.trim();
  const price = card.querySelector(".price-placeholder");

  if (price && title && CONFIG.quartos[title]) {
    price.textContent = CONFIG.quartos[title];
  }
});

/* =========================================
   FORMULÁRIO DE RESERVA
========================================= */

const bookingForm = document.getElementById("bookingForm");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

if (checkin && checkout) {
  const today = getLocalDateString();

  checkin.min = today;
  checkout.min = today;

  checkin.addEventListener("change", () => {
    if (!checkin.value) {
      checkout.min = today;
      return;
    }

    const nextDay = new Date(`${checkin.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);

    const minimumCheckout = getLocalDateString(nextDay);

    checkout.min = minimumCheckout;

    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = minimumCheckout;
    }
  });
}

/* =========================================
   SELECIONAR ACOMODAÇÃO AUTOMATICAMENTE
========================================= */

document.querySelectorAll("[data-room]").forEach(link => {
  link.addEventListener("click", () => {
    const roomType = document.getElementById("roomType");

    if (roomType) {
      roomType.value = link.dataset.room;
    }
  });
});

/* =========================================
   ENVIAR PEDIDO DE RESERVA
========================================= */

if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const error = document.getElementById("formError");

    if (error) {
      error.hidden = true;
      error.textContent = "";
    }

    const name =
      document.getElementById("guestName")?.value.trim() || "";

    const arrival = checkin?.value || "";
    const departure = checkout?.value || "";

    const guests =
      document.getElementById("guests")?.value || "";

    const room =
      document.getElementById("roomType")?.value || "";

    const notes =
      document.getElementById("notes")?.value.trim() || "";

    function showError(message, field) {
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }

      if (field) field.focus();
    }

    if (!name || !arrival || !departure) {
      showError(
        "Preencha seu nome e as datas de entrada e saída.",
        !name
          ? document.getElementById("guestName")
          : !arrival
            ? checkin
            : checkout
      );

      return;
    }

    if (departure <= arrival) {
      showError(
        "A data de check-out precisa ser posterior à data de check-in.",
        checkout
      );

      return;
    }

    const today = getLocalDateString();

    if (arrival < today) {
      showError(
        "Escolha uma data de check-in a partir de hoje.",
        checkin
      );

      return;
    }

    const message = [
      `Olá! Gostaria de consultar uma reserva na ${CONFIG.nome}.`,
      "",
      `Nome: ${name}`,
      `Check-in: ${formatDate(arrival)}`,
      `Check-out: ${formatDate(departure)}`,
      `Hóspedes: ${guests}`,
      `Acomodação desejada: ${room}`,
      notes ? `Observações: ${notes}` : "",
      "",
      "Poderiam confirmar a disponibilidade, o valor total e o valor do sinal via Pix?",
      "Entendo que esta mensagem é uma solicitação e que a reserva só estará confirmada após o retorno da pousada."
    ].filter(Boolean).join("\n");

    openWhatsApp(message);
  });
}

/* =========================================
   LINKS GERAIS DO WHATSAPP
========================================= */

const genericMessage =
  `Olá! Gostaria de mais informações sobre a ${CONFIG.nome}, em ${CONFIG.cidade}.`;

["locationWhatsApp", "footerWhatsApp", "floatingWhatsApp"].forEach(id => {
  const element = document.getElementById(id);

  if (!element) return;

  element.href = whatsappUrl(genericMessage);
  element.target = "_blank";
  element.rel = "noopener noreferrer";
});

/* =========================================
   ANO AUTOMÁTICO NO RODAPÉ
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   ENDEREÇO
========================================= */

if (
  CONFIG.endereco &&
  CONFIG.endereco !== "Adicione o endereço completo da pousada aqui"
) {
  const addressParagraph = document.querySelector(".location-card p");

  if (addressParagraph) {
    addressParagraph.textContent = CONFIG.endereco;
  }
}

/* =========================================
   LINK OPCIONAL DO MAPA
========================================= */

if (CONFIG.mapaUrl) {
  const locationButton = document.getElementById("locationWhatsApp");

  if (locationButton) {
    locationButton.href = CONFIG.mapaUrl;
    locationButton.textContent = "Ver no mapa ↗";
    locationButton.target = "_blank";
    locationButton.rel = "noopener noreferrer";
  }
}
