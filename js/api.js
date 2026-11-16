// Endpoint da API local de cafes
const API_URL = "http://localhost:3000/cafes";

// Busca a lista completa de cafes
export async function fetchCafes() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Erro ao buscar cafés: ${response.status}`);
  }
  return await response.json();
}

// Busca um cafe especifico pelo ID
export async function fetchCafeById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar café id ${id}: ${response.status}`);
  }
  return await response.json();
}
