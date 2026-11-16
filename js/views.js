// Módulo de Renderização do DOM utilizando apenas JavaScript puro
import { getCart, addToCart, increaseQuantity, decreaseQuantity, getCartTotal, getCartItemsCount, clearCart } from "./cart.js";
import { fetchCafes } from "./api.js";

/**
 * Cria a barra de navegação superior (Navbar) comum às páginas
 */
export function createNavbar(activePage, navigateTo) {
  const nav = document.createElement("nav");
  nav.className = "navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3";

  const totalCount = getCartItemsCount();

  nav.innerHTML = `
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="#" id="nav-brand">
        <i class="bi bi-cup-hot-fill text-warning"></i>
        <span>Café & Aroma</span>
      </a>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-light position-relative d-flex align-items-center gap-2" id="nav-cart-btn" title="Ver carrinho de compras">
          <i class="bi bi-cart3 fs-5"></i>
          <span class="d-none d-sm-inline">Carrinho</span>
          <span class="badge bg-warning text-dark rounded-pill" id="cart-badge-count">${totalCount}</span>
        </button>
      </div>
    </div>
  `;

  // Event listeners dos botões da Navbar
  nav.querySelector("#nav-brand").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("home");
  });

  nav.querySelector("#nav-cart-btn").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("cart");
  });

  return nav;
}

/**
 * Renderiza a Página 1: Catálogo Inicial de Cafés
 */
export async function renderHomePage(root, navigateTo) {
  root.innerHTML = "";
  root.appendChild(createNavbar("home", navigateTo));

  const main = document.createElement("main");
  main.className = "container my-5";

  // Cabeçalho da página
  const heroSection = document.createElement("div");
  heroSection.className = "text-center mb-5";
  heroSection.innerHTML = `
    <h1 class="fw-bold display-5 text-dark mb-3">Nossos Cafés Especiais</h1>
    <p class="text-secondary lead mx-auto" style="max-width: 650px;">
      Descubra grãos selecionados, torras nobres e combinações irresistíveis preparadas com carinho.
    </p>
  `;
  main.appendChild(heroSection);

  // Container onde os cards serão inseridos
  const gridContainer = document.createElement("div");
  gridContainer.className = "row g-4";

  // Loading indicador
  gridContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Carregando cardápio de cafés...</p>
    </div>
  `;
  main.appendChild(gridContainer);
  root.appendChild(main);

  // Busca os cafés da API
  const cafes = await fetchCafes();
  gridContainer.innerHTML = "";

  if (!cafes || cafes.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">Nenhum café disponível no momento.</p>
      </div>
    `;
    return;
  }

  cafes.forEach((cafe) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const ingredientsBadges = (cafe.ingredients || [])
      .map(ing => `<span class="badge badge-ingredient border py-1 px-2 rounded-2">${ing}</span>`)
      .join(" ");

    col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-coffee">
        <img src="${cafe.image}" class="card-img-top coffee-img" alt="${cafe.title}">
        <div class="card-body d-flex flex-column p-4">
          <div class="d-flex justify-content-between align-items-baseline mb-2">
            <h5 class="card-title fw-bold text-dark mb-0">${cafe.title}</h5>
            <span class="fs-5 fw-bold text-success">R$ ${Number(cafe.price).toFixed(2)}</span>
          </div>
          <p class="card-text text-secondary small flex-grow-1 mb-3">${cafe.description}</p>
          <div class="mb-4 d-flex flex-wrap gap-1">
            ${ingredientsBadges}
          </div>
          <button class="btn btn-warning fw-semibold w-100 py-2 d-flex align-items-center justify-content-center gap-2 add-to-cart-btn">
            <i class="bi bi-cart-plus-fill"></i> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;

    // Event listener do botão Adicionar ao Carrinho
    const btnAdd = col.querySelector(".add-to-cart-btn");
    btnAdd.addEventListener("click", () => {
      addToCart(cafe);
      // Atualiza badge de contagem
      const badge = document.getElementById("cart-badge-count");
      if (badge) badge.textContent = getCartItemsCount();

      // Feedback visual rápido
      const originalText = btnAdd.innerHTML;
      btnAdd.className = "btn btn-success fw-semibold w-100 py-2 d-flex align-items-center justify-content-center gap-2";
      btnAdd.innerHTML = '<i class="bi bi-check2-circle"></i> Adicionado!';
      setTimeout(() => {
        btnAdd.className = "btn btn-warning fw-semibold w-100 py-2 d-flex align-items-center justify-content-center gap-2";
        btnAdd.innerHTML = originalText;
      }, 900);
    });

    gridContainer.appendChild(col);
  });
}

/**
 * Renderiza a Página 2: Carrinho de Compras
 */
export function renderCartPage(root, navigateTo) {
  root.innerHTML = "";
  root.appendChild(createNavbar("cart", navigateTo));

  const main = document.createElement("main");
  main.className = "container my-5";

  const cart = getCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    main.innerHTML = `
      <div class="text-center py-5 my-5">
        <i class="bi bi-cart-x text-muted display-1"></i>
        <h2 class="mt-4 fw-bold">Seu carrinho está vazio</h2>
        <p class="text-secondary mb-4">Que tal dar uma olhada em nossos cafés fresquinhos?</p>
        <button class="btn btn-warning px-4 py-2 fw-semibold" id="go-shopping-btn">
          <i class="bi bi-arrow-left"></i> Explorar Cafés
        </button>
      </div>
    `;
    root.appendChild(main);
    main.querySelector("#go-shopping-btn").addEventListener("click", () => navigateTo("home"));
    return;
  }

  main.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="fw-bold mb-0">Seu Carrinho de Compras</h2>
      <button class="btn btn-outline-secondary btn-sm" id="back-home-btn">
        <i class="bi bi-arrow-left"></i> Continuar Comprando
      </button>
    </div>
    
    <div class="row g-4">
      <!-- Lista de Itens -->
      <div class="col-12 col-lg-8" id="cart-items-col"></div>
      
      <!-- Resumo do Pedido -->
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 100px;">
          <h4 class="fw-bold mb-3">Resumo da Compra</h4>
          <div class="d-flex justify-content-between text-secondary mb-2">
            <span>Subtotal</span>
            <span>R$ ${total.toFixed(2)}</span>
          </div>
          <div class="d-flex justify-content-between text-secondary mb-3">
            <span>Frete</span>
            <span class="text-success fw-bold">Grátis</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between align-items-baseline mb-4">
            <span class="fs-5 fw-bold">Total Acumulado</span>
            <span class="fs-4 fw-bold text-success">R$ ${total.toFixed(2)}</span>
          </div>
          <button class="btn btn-success btn-lg w-100 fw-bold py-3" id="btn-checkout">
            Finalizar Compra <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  root.appendChild(main);

  main.querySelector("#back-home-btn").addEventListener("click", () => navigateTo("home"));
  main.querySelector("#btn-checkout").addEventListener("click", () => navigateTo("checkout"));

  const itemsContainer = main.querySelector("#cart-items-col");

  cart.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card border-0 shadow-sm rounded-4 mb-3 p-3";
    card.innerHTML = `
      <div class="row align-items-center g-3">
        <div class="col-3 col-sm-2">
          <img src="${item.image}" alt="${item.title}" class="img-fluid rounded-3" style="object-fit: cover; height: 75px; width: 100%;">
        </div>
        <div class="col-9 col-sm-4">
          <h6 class="fw-bold mb-1">${item.title}</h6>
          <span class="text-secondary small">Preço: R$ ${item.price.toFixed(2)}</span>
        </div>
        <div class="col-6 col-sm-3 d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary btn-decrease" title="Diminuir unidade">
            <i class="bi bi-dash"></i>
          </button>
          <span class="fw-bold px-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary btn-increase" title="Aumentar unidade">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        <div class="col-6 col-sm-3 text-end">
          <span class="fw-bold text-dark fs-6">R$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    `;

    // Ações de aumentar e diminuir quantidade
    card.querySelector(".btn-decrease").addEventListener("click", () => {
      decreaseQuantity(item.id);
      renderCartPage(root, navigateTo);
    });

    card.querySelector(".btn-increase").addEventListener("click", () => {
      increaseQuantity(item.id);
      renderCartPage(root, navigateTo);
    });

    itemsContainer.appendChild(card);
  });
}

/**
 * Renderiza a Página 3: Finalização de Compra (Checkout)
 */
export function renderCheckoutPage(root, navigateTo) {
  root.innerHTML = "";
  root.appendChild(createNavbar("checkout", navigateTo));

  const main = document.createElement("main");
  main.className = "container my-5";

  const cart = getCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    main.innerHTML = `
      <div class="text-center py-5">
        <p class="text-muted">Seu carrinho está vazio para finalizar uma compra.</p>
        <button class="btn btn-warning" id="go-home-btn">Voltar para o Início</button>
      </div>
    `;
    root.appendChild(main);
    main.querySelector("#go-home-btn").addEventListener("click", () => navigateTo("home"));
    return;
  }

  main.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="fw-bold mb-0">Finalização de Compra</h2>
      <button class="btn btn-outline-secondary btn-sm" id="btn-back-cart">
        <i class="bi bi-arrow-left"></i> Voltar ao Carrinho
      </button>
    </div>

    <div class="row g-4">
      <!-- Formulário de Entrega e Pagamento -->
      <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h4 class="fw-bold mb-4"><i class="bi bi-truck text-warning"></i> Informações do Pedido</h4>
          <form id="checkout-form" novalidate>
            <!-- Endereço -->
            <div class="mb-3">
              <label for="addressInput" class="form-label fw-semibold">Endereço de Entrega</label>
              <input type="text" class="form-control form-control-lg" id="addressInput" placeholder="Rua, número, bairro, complemento..." required>
              <div class="invalid-feedback">Por favor, insira o endereço de entrega completo.</div>
            </div>

            <!-- Método de Pagamento -->
            <div class="mb-4">
              <label for="paymentSelect" class="form-label fw-semibold">Método de Pagamento</label>
              <select class="form-select form-select-lg" id="paymentSelect" required>
                <option value="" disabled selected>Selecione uma forma de pagamento...</option>
                <option value="pix">PIX (Confirmação Imediata)</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
              <div class="invalid-feedback">Selecione uma forma de pagamento para continuar.</div>
            </div>

            <button type="submit" class="btn btn-success btn-lg w-100 fw-bold py-3" id="btn-finalize">
              <i class="bi bi-check-circle-fill"></i> Finalizar Pedido
            </button>
          </form>
        </div>
      </div>

      <!-- Resumo dos Itens no momento da finalização -->
      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-3">Itens do Pedido</h5>
          <ul class="list-group list-group-flush mb-3" id="checkout-items-list">
            ${cart.map(item => `
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 class="my-0 fw-semibold">${item.title}</h6>
                  <small class="text-secondary">${item.quantity}x de R$ ${item.price.toFixed(2)}</small>
                </div>
                <span class="text-dark fw-bold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            `).join("")}
          </ul>
          <hr>
          <div class="d-flex justify-content-between align-items-center fs-5">
            <span class="fw-bold">Total a Pagar:</span>
            <span class="fw-bold text-success fs-4">R$ ${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  root.appendChild(main);

  main.querySelector("#btn-back-cart").addEventListener("click", () => navigateTo("cart"));

  // Validação e Envio do Formulário
  const form = main.querySelector("#checkout-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const address = main.querySelector("#addressInput").value.trim();
    const payment = main.querySelector("#paymentSelect").value;

    let isValid = true;

    if (!address) {
      main.querySelector("#addressInput").classList.add("is-invalid");
      isValid = false;
    } else {
      main.querySelector("#addressInput").classList.remove("is-invalid");
    }

    if (!payment) {
      main.querySelector("#paymentSelect").classList.add("is-invalid");
      isValid = false;
    } else {
      main.querySelector("#paymentSelect").classList.remove("is-invalid");
    }

    if (!isValid) return;

    // Limpa o carrinho no LocalStorage conforme requisito 2
    clearCart();

    // Renderiza a confirmação de compra
    renderSuccessMessage(root, navigateTo, address, payment, total);
  });
}

/**
 * Mensagem de confirmação de compra com sucesso
 */
function renderSuccessMessage(root, navigateTo, address, payment, total) {
  root.innerHTML = "";
  root.appendChild(createNavbar("home", navigateTo));

  const paymentNames = {
    pix: "PIX",
    credit_card: "Cartão de Crédito",
    boleto: "Boleto Bancário"
  };

  const main = document.createElement("main");
  main.className = "container my-5";
  main.innerHTML = `
    <div class="card border-0 shadow-sm rounded-4 p-5 text-center mx-auto" style="max-width: 620px;">
      <div class="mb-3 text-success">
        <i class="bi bi-check-circle-fill display-1"></i>
      </div>
      <h2 class="fw-bold text-dark mb-2">Pedido Confirmado!</h2>
      <p class="text-secondary mb-4">Muito obrigado! Seu café já está sendo preparado com muito carinho.</p>

      <div class="bg-light p-4 rounded-3 text-start mb-4">
        <p class="mb-1"><strong>Endereço de Entrega:</strong> ${address}</p>
        <p class="mb-1"><strong>Forma de Pagamento:</strong> ${paymentNames[payment] || payment}</p>
        <p class="mb-0"><strong>Total Pago:</strong> <span class="text-success fw-bold">R$ ${total.toFixed(2)}</span></p>
      </div>

      <button class="btn btn-warning btn-lg fw-semibold" id="btn-back-to-shop">
        <i class="bi bi-house-door-fill"></i> Voltar à Loja
      </button>
    </div>
  `;

  root.appendChild(main);
  main.querySelector("#btn-back-to-shop").addEventListener("click", () => navigateTo("home"));
}
