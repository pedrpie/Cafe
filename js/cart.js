// Chave utilizada para persistir os dados no localStorage
const CART_STORAGE_KEY = "coffee_shop_cart";

// Recupera a lista de itens salvos no localStorage
export function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Salva a lista de itens atualizada no localStorage
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Adiciona um cafe ao carrinho ou incrementa sua quantidade
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

// Diminui a quantidade de um item ou o remove se chegar a zero
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

// Incrementa em uma unidade a quantidade do cafe
export function increaseQuantity(cafeId) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === cafeId);

  if (existingItem) {
    existingItem.quantity += 1;
    saveCart(cart);
  }
}

// Calcula o valor total acumulado do carrinho
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

// Retorna a contagem total de unidades de itens no carrinho
export function getCartItemsCount() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Remove todos os itens do carrinho no localStorage
export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}
