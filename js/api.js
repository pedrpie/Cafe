// Módulo responsável pela comunicação com a API (json-server)
const API_URL = "http://localhost:3000/cafes";

// Fallback com dados locais caso o json-server não esteja em execução no momento
const FALLBACK_CAFES = [
  {
    id: 1,
    title: "Black Coffee",
    description: "Café preto puro, feito apenas com grãos moídos e água quente. É simples e ideal para apreciar o sabor natural do café.",
    ingredients: ["Café"],
    price: 3.0,
    image: "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Latte Cremoso",
    description: "Uma mistura cremosa de espresso e leite vaporizado, com uma fina camada de espuma sedosa por cima.",
    ingredients: ["Espresso", "Leite vaporizado"],
    price: 4.5,
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&q=60&w=800"
  },
  {
    id: 3,
    title: "Cappuccino Italiano",
    description: "Equilíbrio clássico entre espresso encorpado, leite vaporizado, generosa espuma cremosa e canela em pó.",
    ingredients: ["Espresso", "Leite vaporizado", "Espuma de leite", "Canela"],
    price: 5.0,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Mocha Chocolate",
    description: "Combinação irresistível de espresso encorpado, calda de chocolate meio amargo, leite vaporizado e chantilly.",
    ingredients: ["Espresso", "Calda de chocolate", "Leite vaporizado", "Chantilly"],
    price: 6.0,
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Espresso Macchiato",
    description: "Dose dupla de espresso forte manchada com uma suave colher de crema de leite.",
    ingredients: ["Espresso duplo", "Crema de leite"],
    price: 3.8,
    image: "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Iced Coffee Gelado",
    description: "Café gelado refrescante preparado com extração a frio, cubos de gelo e gotas de extrato de baunilha.",
    ingredients: ["Café concentrado", "Gelo", "Leite gelado", "Baunilha"],
    price: 5.5,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    title: "Caramel Macchiato",
    description: "Leite vaporizado com xarope de baunilha, finalizado com dose de espresso e generosos fios de caramelo artesanal.",
    ingredients: ["Espresso", "Leite vaporizado", "Xarope de baunilha", "Calda de caramelo"],
    price: 6.5,
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    title: "Affogato Al Caffè",
    description: "A tradicional sobremesa italiana: uma bola generosa de sorvete de baunilha mergulhada em um espresso quente.",
    ingredients: ["Espresso quente", "Sorvete de baunilha"],
    price: 7.0,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    title: "Cold Brew Especial",
    description: "Infusão a frio com grãos especiais maturada por 18 horas. Bebida suave, encorpada e de baixa acidez.",
    ingredients: ["Café especial em infusão fria", "Gelo filtrado"],
    price: 5.8,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    title: "Flat White Australiano",
    description: "Dose dupla de ristretto harmonizada com microespuma aveludada de leite, proporcionando sabor intenso e aveludado.",
    ingredients: ["Ristretto duplo", "Microespuma de leite"],
    price: 4.8,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    title: "Frappuccino Avelã",
    description: "Bebida batida com café expresso, cubos de gelo, leite integral, pasta de avelã e cobertura de chocolate crocante.",
    ingredients: ["Espresso", "Creme de avelã", "Leite", "Chantilly", "Gelo"],
    price: 7.5,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    title: "Irish Coffee",
    description: "Café quente enriquecido com uísque irlandês, açúcar mascavo e uma camada espessa de creme fresco batido.",
    ingredients: ["Café quente", "Uísque irlandês", "Açúcar mascavo", "Creme batido"],
    price: 8.0,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
  }
];

export async function fetchCafes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("API json-server não encontrada em http://localhost:3000/cafes. Usando dados locais como fallback.", error);
    return FALLBACK_CAFES;
  }
}

export async function fetchCafeById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar café");
    return await response.json();
  } catch (error) {
    return FALLBACK_CAFES.find(c => c.id === Number(id)) || null;
  }
}
