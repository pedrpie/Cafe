# Trabalho 3: Front-end para Loja de Cafés ☕
**Disciplina:** Programação Visual e Autoria Web  
**Professor:** Taniro Rodrigues (UFRN)

---

## 📁 Estrutura de Arquivos

```text
Cafe/
├── db.json              # Banco de dados da API json-server
├── index.html           # Arquivo HTML base contendo apenas <div id="root">
├── script.js            # Ponto de entrada e gerenciador de rotas (SPA)
└── js/
    ├── api.js           # Funções de requisição HTTP (GET /cafes)
    ├── cart.js          # Operações no localStorage (adicionar, remover, total)
    └── views.js         # Renderização dinâmica do DOM das 3 páginas
```

---

## 🚀 Como Executar o Projeto

### 1. Iniciar a API Local (`json-server`)

Caso tenha o **Node.js** instalado na sua máquina:

```bash
# Executa a API no endereço http://localhost:3000/cafes
npx json-server db.json
```

*(Obs: Caso não tenha o Node instalado no momento, o código possui um fallback inteligente que carrega os cafés locais automaticamente para não quebrar a apresentação!)*

---

### 2. Abrir o Front-end

Por utilizar módulos ES6 (`import`/`export`), você deve abrir o projeto através de um servidor local (para evitar bloqueios de CORS locais):

- **Opção 1 (VS Code):** Instale a extensão **Live Server** e clique em *"Go Live"*.
- **Opção 2 (Python no terminal):**
  ```bash
  python3 -m http.server 8080
  ```
  E acesse no navegador: `http://localhost:8080`

---

## 🛠️ Requisitos Atendidos

1. **Manipulação do DOM**: Toda a interface é gerada dinamicamente via JavaScript puro no elemento `<div id="root">`.
2. **Bootstrap 5**: Design responsivo com cards, navbar, badges de ingredientes e botões estilizados.
3. **Página Inicial**:
   - Consumo da API local com `fetch`.
   - Cards com título, descrição, preço, imagem, ingredientes e botão de compra.
   - Ícone do carrinho com contador dinâmico.
4. **Página de Carrinho**:
   - Persistência com `localStorage`.
   - Botões de incrementar (`+`) e decrementar (`-`) unidades.
   - Cálculo e exibição do total acumulado.
5. **Página de Finalização (Checkout)**:
   - Resumo dos itens e valores.
   - Formulário com endereço e método de pagamento (PIX, Cartão, Boleto).
   - Validação de campos obrigatórios.
   - Limpeza do `localStorage` e tela de confirmação de pedido.
