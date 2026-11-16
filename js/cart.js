// Módulo de Gerenciamento do Carrinho de Compras via localStorage

const CART_STORAGE_KEY = "coffee_shop_cart";

/**
 * Retorna todos os itens do carrinho salvos no localStorage
 * Formato do item: { id, title, price, image, quantity }
 */
export function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao ler localStorage", e);
    return [];
  }
}

/**
 * Salva a lista de itens no localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Adiciona um café ao carrinho (ou incrementa a quantidade se já existir)
 */
export function addToCart(cafe) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === cafe.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: cafe.id,
      title: cafe.title,
      price: Number(cafe.price),
      image: cafe.image,
      quantity: 1
    });
  }

  saveCart(cart);
}

/**
 * Remove uma unidade de um café do carrinho. Se zerar, remove o item da lista.
 */
export function decreaseQuantity(cafeId) {
  let cart = getCart();
  const existingItem = cart.find(item => item.id === cafeId);

  if (existingItem) {
    existingItem.quantity -= 1;
    if (existingItem.quantity <= 0) {
      cart = cart.filter(item => item.id !== cafeId);
    }
    saveCart(cart);
  }
}

/**
 * Aumenta uma unidade de um café no carrinho
 */
export function increaseQuantity(cafeId) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === cafeId);

  if (existingItem) {
    existingItem.quantity += 1;
    saveCart(cart);
  }
}

/**
 * Retorna o total acumulado do carrinho (R$)
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

/**
 * Retorna a contagem total de itens no carrinho
 */
export function getCartItemsCount() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * Limpa todo o carrinho no localStorage (ex: após finalizar compra)
 */
export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}
