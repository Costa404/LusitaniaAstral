// Configurações
const TAXA_BTC_EUR = 60000;
let mostrarEmEur = false;
const imagemEspacoProfundo =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80";

// 1. Alteramos para let e começamos com um array vazio
let inventario = [];

let favoritos = JSON.parse(localStorage.getItem("favoritosLusitania")) || [];

// 2. Tornamos a função assíncrona para esperar pela API
async function inicializar() {
  atualizarContador();

  try {
    // 3. Fazer o pedido à API exterior (Substitui este URL pelo teu)
    const resposta = await fetch("https://api.exemplo.com/planetas");

    if (!resposta.ok) {
      throw new Error("Erro na rede: " + resposta.status);
    }

    // 4. Guardar os dados recebidos na nossa variável
    inventario = await resposta.json();

    // 5. Desenhar a grelha com os dados reais
    renderizarGrelha(inventario);
  } catch (erro) {
    console.error("Falha ao carregar os dados da API:", erro);
    const grelha = document.getElementById("grelha-planetas");
    grelha.innerHTML =
      '<p class="text-red-500 col-span-full text-center py-8">Erro nas comunicações inter-galácticas. Não foi possível carregar os planetas.</p>';
  }
}

function renderizarGrelha(planetas) {
  const grelha = document.getElementById("grelha-planetas");
  grelha.innerHTML = "";

  if (planetas.length === 0) {
    grelha.innerHTML =
      '<p class="text-slate-400 col-span-full text-center py-8">Nenhum planeta encontrado com esses recursos.</p>';
    return;
  }

  planetas.forEach((planeta) => {
    const isFavorito = favoritos.includes(planeta.id);
    const iconeEstrela = isFavorito ? "★" : "☆";
    const corEstrela = isFavorito ? "text-yellow-400" : "text-slate-400";

    // Cálculo de preço
    let displayPreco = `${planeta.preco} BTC`;
    if (mostrarEmEur) {
      const precoEur = (planeta.preco * TAXA_BTC_EUR).toLocaleString("pt-PT");
      displayPreco = `${precoEur} €`;
    }

    const cardHTML = `
      <article class="glass-card rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col">
          <div class="relative h-48">
              <img src="${planeta.fotos[0]}" 
                   onerror="this.onerror=null; this.src='${imagemEspacoProfundo}';" 
                   alt="Vista de ${planeta.nome}" 
                   class="w-full h-full object-cover">
              <button onclick="alternarFavorito('${planeta.id}')" 
                      class="absolute top-2 right-2 bg-slate-900/80 p-2 rounded-full ${corEstrela} hover:text-yellow-300 transition text-xl leading-none">
                  ${iconeEstrela}
              </button>
          </div>
          <div class="p-5 flex-1 flex flex-col">
              <h3 class="text-xl font-bold text-white mb-1">${planeta.nome}</h3>
              <p class="text-sm text-cyan-400 mb-4 flex items-center gap-2">
                  🌌 ${planeta.galaxia}
              </p>
              <div class="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span class="font-mono font-bold text-yellow-500 text-lg">${displayPreco}</span>
                  <a href="detalhes.html?id=${planeta.id}" class="text-sm bg-cyan-700 hover:bg-cyan-600 px-3 py-1 rounded text-white transition">Detalhes</a>
              </div>
          </div>
      </article>
    `;
    grelha.innerHTML += cardHTML;
  });
}

// Conversor de Moeda
function alternarMoeda() {
  mostrarEmEur = !mostrarEmEur;
  document.getElementById("btn-moeda").innerText = mostrarEmEur
    ? "Mostrar em BTC"
    : "Mostrar em EUR";
  filtrarPlanetas();
}

// Filtro (Continua a funcionar sem ir à API de novo porque guardámos os dados na variável inventario)
function filtrarPlanetas() {
  const recursoSelecionado = document.getElementById("filtro-recurso").value;

  if (recursoSelecionado === "todos") {
    renderizarGrelha(inventario);
  } else {
    const filtrados = inventario.filter((p) =>
      p.recursos.includes(recursoSelecionado),
    );
    renderizarGrelha(filtrados);
  }
}

// Favoritos
function alternarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter((f) => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritosLusitania", JSON.stringify(favoritos));
  atualizarContador();
  filtrarPlanetas();
}

function atualizarContador() {
  document.getElementById("contador-favoritos").innerText = favoritos.length;
}

// Iniciar
inicializar();
