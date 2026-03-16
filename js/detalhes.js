document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const planetaId = params.get("id");

  try {
    const resposta = await fetch(
      "https://formacoes-api.onrender.com/imobiliaria-interplanetaria",
    );
    const inventario = await resposta.json();

    const planeta = inventario.find((p) => String(p.id) === String(planetaId));

    if (planeta) {
      document.getElementById("planeta-nome").textContent = planeta.nome;

      const propsContainer = document.getElementById("planeta-props");

      propsContainer.innerHTML = `
        <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">ID:</strong> #${planeta.id}</li>
        <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Galáxia:</strong> ${planeta.galaxia}</li>
        <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Sistema:</strong> ${planeta.sistema_estrelar}</li>
        <li class="border-b border-cyan-900/50 pb-2"><strong class="text-cyan-300">Recursos:</strong> ${planeta.recursos.fauna}, ${planeta.recursos.flora}</li>
        <li class="pt-2"><strong class="text-fuchsia-400">Valor:</strong> ${planeta.preco_btc} BTC</li>
      `;

      const galeriaContainer = document.getElementById("planeta-galeria");
      galeriaContainer.innerHTML = ""; // Limpar antes de preencher

      const urlBase = "formacoes-api.onrender.com/imobiliaria-interplanetaria";

      planeta.fotos.forEach((imgUrl) => {
        const linkReal = urlBase + imgUrl.replace("./", "/");

        galeriaContainer.innerHTML += `
    <img src="${linkReal}" 
         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400';" 
         alt="Vista de ${planeta.nome}" 
         class="w-full h-32 object-cover border border-cyan-800 hover:border-cyan-400 transition-colors cursor-pointer" />
  `;
      });
    } else {
      document.getElementById("planeta-nome").textContent =
        "Exploração falhou: Planeta não mapeado.";
    }
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
  }
});
