// Ponto de entrada da aplicação (SPA Router e Inicialização)
import { renderHomePage, renderCartPage, renderCheckoutPage } from "./js/views.js";

// Obtém o elemento root especificado nas exigências
const root = document.getElementById("root");

/**
 * Função responsável por alternar entre as 3 telas principais:
 * - "home": Página inicial com a lista de cafés
 * - "cart": Página do carrinho com botões + / - e total
 * - "checkout": Página de finalização com endereço e pagamento
 */
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

// Inicializa a aplicação na página inicial
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("home");
});
