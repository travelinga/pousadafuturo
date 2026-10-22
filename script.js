/*
  POUSADA FUTURO — CONFIGURAÇÕES FÁCEIS
  Edite os campos abaixo. O WhatsApp deve conter apenas números:
  código do país + DDD + número. Exemplo: 5511999999999
*/
const CONFIG = {
  nome: "Pousada Futuro",
  cidade: "Ubatuba - SP",
  // Número informado: 15981689760. Incluímos o código do Brasil (55).
  whatsapp: "5515981689760",
  endereco: "Adicione o endereço completo da pousada aqui",
  // Substitua pelos preços reais. Use por exemplo: "R$ 180,00".
  quartos: {
    "Quarto Casal": "Consulte",
    "Quarto Família": "Consulte",
    "Quarto Triplo": "Consulte"
  },
  // URL opcional do Google Maps. Pode ser adicionada depois.
  mapaUrl: ""
};

const whatsappUrl = (message) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

function openWhatsApp(message) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Preços editáveis pela CONFIG acima.
document.querySelectorAll(".room-card").forEach(card => {
  const title = card.querySelector("h3")?.textContent.trim();
  const price = card.querySelector(".price-placeholder");
  if (price && CONFIG.quartos[title]) price.textContent = CONFIG.quartos[title];
});

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
checkin.min = localToday;
checkout.min = localToday;
checkin.addEventListener("change", () => {
  if (checkin.value) {
    const nextDay = new Date(`${checkin.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    const minimumCheckout = `${nextDay.getFullYear()}-${String(nextDay.getMonth()+1).padStart(2,"0")}-${String(nextDay.getDate()).padStart(2,"0")}`;
    checkout.min = minimumCheckout;
    if (checkout.value && checkout.value <= checkin.value) checkout.value = minimumCheckout;
  }
});

document.querySelectorAll("[data-room]").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("roomType").value = link.dataset.room;
  });
});

document.getElementById("bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const error = document.getElementById("formError");
  error.hidden = true;
  const name = document.getElementById("guestName").value.trim();
  const arrival = checkin.value;
  const departure = checkout.value;
  const guests = document.getElementById("guests").value;
  const room = document.getElementById("roomType").value;
  const notes = document.getElementById("notes").value.trim();

  if (!name || !arrival || !departure) {
    error.textContent = "Preencha seu nome e as datas de entrada e saída.";
    error.hidden = false;
    return;
  }
  if (departure <= arrival) {
    error.textContent = "A data de check-out precisa ser posterior à data de check-in.";
    error.hidden = false;
    checkout.focus();
    return;
  }
  if (arrival < localToday) {
    error.textContent = "Escolha uma data de check-in a partir de hoje.";
    error.hidden = false;
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

const genericMessage = `Olá! Gostaria de mais informações sobre a ${CONFIG.nome}, em ${CONFIG.cidade}.`;
["locationWhatsApp", "footerWhatsApp", "floatingWhatsApp"].forEach(id => {
  const element = document.getElementById(id);
  element.href = whatsappUrl(genericMessage);
  element.target = "_blank";
  element.rel = "noopener noreferrer";
});
document.getElementById("year").textContent = new Date().getFullYear();

if (CONFIG.endereco && CONFIG.endereco !== "Adicione o endereço completo da pousada aqui") {
  const addressParagraph = document.querySelector(".location-card p");
  addressParagraph.textContent = CONFIG.endereco;
}
if (CONFIG.mapaUrl) {
  document.getElementById("locationWhatsApp").href = CONFIG.mapaUrl;
  document.getElementById("locationWhatsApp").textContent = "Ver no mapa ↗";
  document.getElementById("locationWhatsApp").target = "_blank";
}
