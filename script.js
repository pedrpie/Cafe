// Ponto de entrada e roteador da aplicacao
import { renderHomePage, renderCartPage, renderCheckoutPage } from "./js/views.js";

// Elemento container onde o conteudo dinamico e inserido
const root = document.getElementById("root");

// Alterna a tela renderizada conforme a rota solicitada
function navigateTo(page) {
  window.scrollTo({ top: 0, behavior: "smooth" });

  switch (page) {
    case "cart":
      renderCartPage(root, navigateTo);
      break;
    case "checkout":
      renderCheckoutPage(root, navigateTo);
      break;
    case "home":
    default:
      renderHomePage(root, navigateTo);
      break;
  }
}

// Inicializa a aplicacao na tela inicial ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("home");
});
