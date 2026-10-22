
/*
  POUSADA FUTURO — CONSULTA DE DATAS E PREÇOS
  Os preços são referências iniciais por diária.
  O valor final e a disponibilidade são confirmados pela pousada.
*/

const CONFIG = {
  nome: "Pousada Futuro",
  cidade: "Ubatuba - SP",
  whatsapp: "5515981689760",

  // Valores de referência por diária, em reais.
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
   DATAS DA HOSPEDAGEM
========================================= */

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const localToday = getLocalDateString();

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const roomType = document.getElementById("roomType");
const bookingForm = document.getElementById("bookingForm");
const formError = document.getElementById("formError");

if (checkin && checkout) {
  checkin.min = localToday;
  checkout.min = localToday;

  checkin.addEventListener("change", () => {
    if (!checkin.value) return;

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
   SELECIONAR ACOMODAÇÃO
========================================= */

document.querySelectorAll(".room-consult[data-room]").forEach(link => {
  link.addEventListener("click", () => {
    if (roomType) {
      roomType.value = link.dataset.room;
    }
  });
});

/* =========================================
   FORMULÁRIO DE CONSULTA
========================================= */

if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    if (formError) {
      formError.hidden = true;
      formError.textContent = "";
    }

    const nameField = document.getElementById("guestName");
    const guestsField = document.getElementById("guests");
    const notesField = document.getElementById("notes");

    const name = nameField ? nameField.value.trim() : "";
    const arrival = checkin ? checkin.value : "";
    const departure = checkout ? checkout.value : "";
    const guests = guestsField ? guestsField.value : "";
    const room = roomType ? roomType.value : "";
    const notes = notesField ? notesField.value.trim() : "";

    function showError(message, field) {
      if (formError) {
        formError.textContent = message;
        formError.hidden = false;
      }

      if (field) field.focus();
    }

    if (!name || !arrival || !departure) {
      showError(
        "Preencha seu nome e as datas de entrada e saída.",
        !name ? nameField : (!arrival ? checkin : checkout)
      );
      return;
    }

    if (arrival < localToday) {
      showError(
        "Escolha uma data de check-in a partir de hoje.",
        checkin
      );
      return;
    }

    if (departure <= arrival) {
      showError(
        "O check-out precisa ser posterior ao check-in.",
        checkout
      );
      return;
    }

    if (!guests) {
      showError(
        "Informe a quantidade de hóspedes.",
        guestsField
      );
      return;
    }

    if (!room) {
      showError(
        "Selecione a acomodação desejada.",
        roomType
      );
      return;
    }

    /* Calcular a quantidade de noites */
    const arrivalDate = new Date(`${arrival}T12:00:00`);
    const departureDate = new Date(`${departure}T12:00:00`);

    const nights = Math.round(
      (departureDate - arrivalDate) / 86400000
    );

    /* Valor de referência da acomodação */
    const baseRate = CONFIG.quartos[room];

    const baseTotal = Number.isFinite(baseRate)
      ? baseRate * nights
      : null;

    const lines = [
      `Olá! Gostaria de consultar uma reserva na ${CONFIG.nome}.`,
      "",
      `Nome: ${name}`,
      `Check-in: ${formatDate(arrival)}`,
      `Check-out: ${formatDate(departure)}`,
      `Duração: ${nights} ${nights === 1 ? "diária" : "diárias"}`,
      `Hóspedes: ${guests}`,
      `Acomodação desejada: ${room}`,
      Number.isFinite(baseRate)
        ? `Valor de referência anunciado: ${formatMoney(baseRate)} por diária`
        : "",
      baseTotal !== null
        ? `Referência para ${nights} ${nights === 1 ? "diária" : "diárias"}: ${formatMoney(baseTotal)} (não é cotação final; depende da temporada)`
        : "",
      notes ? `Observações: ${notes}` : "",
      "",
      "Poderiam confirmar a disponibilidade e o valor final para essas datas, considerando a temporada e a quantidade de hóspedes?",
      "Entendo que esta mensagem é uma solicitação e que a reserva só estará confirmada após o retorno da pousada."
    ].filter(Boolean);

    openWhatsApp(lines.join("\n"));
  });
}

/* =========================================
   BOTÕES DE WHATSAPP
========================================= */

const genericMessage =
  `Olá! Gostaria de mais informações sobre a ${CONFIG.nome}, em ${CONFIG.cidade}.`;

["locationWhatsApp", "footerWhatsApp", "floatingWhatsApp"].forEach(id => {
  const element = document.getElementById(id);

  if (element) {
    element.href = whatsappUrl(genericMessage);
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }
});

/* =========================================
   ANO AUTOMÁTICO NO RODAPÉ
========================================= */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}
