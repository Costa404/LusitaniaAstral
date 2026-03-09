// Simulação de base de dados (deverá vir da tua API ou LocalStorage)
const planetasDb = [
  { 
    id: 1, 
    nome: "Nova Sintra", 
    clima: "Temperado", 
    gravidade: "1.2G", 
    recursos: "Minério, Fauna Terrestre",
    preco: "450.000 EUR",
    imagens: [
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&q=80",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=500&q=80"
    ]
  },
  // ... outros planetas
];

document.addEventListener("DOMContentLoaded", () => {
  // Capturar o ID do URL usando URLSearchParams
  const params = new URLSearchParams(window.location.search);
  const planetaId = parseInt(params.get("id"));

  const planeta = planetasDb.find(p => p.id === planetaId);

  if (planeta) {
    // Preencher Nome
    document.getElementById("planeta-nome").textContent = planeta.nome;

    // Preencher Propriedades
    const propsContainer = document.getElementById("planeta-props");
    propsContainer.innerHTML = `
      <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">ID de Registo:</strong> #${planeta.id}</li>
      <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Clima:</strong> ${planeta.clima}</li>
      <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Gravidade:</strong> ${planeta.gravidade}</li>
      <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Recursos Dominantes:</strong> ${planeta.recursos}</li>
      <li class="pt-2"><strong class="text-fuchsia-400">Valor de Aquisição:</strong> ${planeta.preco}</li>
    `;

    // Preencher Galeria
    const galeriaContainer = document.getElementById("planeta-galeria");
    planeta.imagens.forEach(imgUrl => {
      galeriaContainer.innerHTML += `
        <img src="${imgUrl}" alt="Vista de ${planeta.nome}" class="w-full h-32 object-cover border border-cyan-800 hover:border-cyan-400 transition-colors cursor-pointer" />
      `;
    });
  } else {
    document.getElementById("planeta-nome").textContent = "Planeta não encontrado";
  }
});