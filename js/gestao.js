const API_URL = "https://api.exemplo.com/planetas";

// Fallback local (para não deixar a UI vazia se a API falhar)
const registosDbFallback = [
  { id: 1, nome: "Nova Sintra", vendedor: "Corporação Tordesilhas", preco: 7.5, status: "À Venda" },
  { id: 2, nome: "Adamastor Prime", vendedor: "Sindicato Gama", preco: 13.2, status: "Vendido" },
  { id: 3, nome: "Éden Lusitano", vendedor: "Mercadores Independentes", preco: 4.1, status: "À Venda" },
];

let registos = [];

function formatarPreco(preco) {
  const num = Number(preco);
  if (!Number.isFinite(num)) return String(preco ?? "");
  return `${num.toLocaleString("pt-PT")} BTC`;
}

function renderizarTabela() {
  const tbody = document.getElementById("tabela-planetas");
  tbody.innerHTML = "";

  registos.forEach((registo) => {
    // Definir cor do status
    const statusColor = registo.status === "À Venda" ? "text-green-400" : "text-red-400";

    tbody.innerHTML += `
      <tr class="hover:bg-cyan-900/20 transition-colors">
        <td class="p-4 font-bold text-cyan-500">#${registo.id}</td>
        <td class="p-4">${registo.nome}</td>
        <td class="p-4">${registo.vendedor}</td>
        <td class="p-4 text-fuchsia-300">${formatarPreco(registo.preco)}</td>
        <td class="p-4 font-bold ${statusColor}">${registo.status}</td>
        <td class="p-4 text-center space-x-2">
          <button onclick="editarPlaneta(${registo.id})" class="text-xs bg-cyan-900/50 hover:bg-cyan-700 text-white px-3 py-1 border border-cyan-500 uppercase transition-all">Editar</button>
          <button onclick="eliminarPlaneta(${registo.id})" class="text-xs bg-red-900/50 hover:bg-red-700 text-white px-3 py-1 border border-red-500 uppercase transition-all">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function editarPlaneta(id) {
  window.location.href = `registo.html?id=${encodeURIComponent(String(id))}`;
}

function eliminarPlaneta(id) {
  if (confirm(`Aviso: Tem a certeza que deseja expurgar o Registo #${id} da base de dados?`)) {
    alert(`Registo #${id} eliminado com sucesso.`);
    // Lógica de eliminação real aqui (ex: filtrar o array e chamar renderizarTabela novamente)
  }
}

async function carregarRegistos() {
  try {
    const resposta = await fetch(API_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!resposta.ok) throw new Error(`GET falhou (${resposta.status})`);
    const dados = await resposta.json();
    registos = Array.isArray(dados) ? dados : [];
  } catch (e) {
    console.error("Falha ao carregar planetas da API:", e);
    registos = registosDbFallback;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarRegistos();
  renderizarTabela();
});