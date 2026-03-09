// Dados simulados
const registosDb = [
  { id: 1, nome: "Nova Sintra", vendedor: "Corporação Tordesilhas", preco: "450.000 EUR", status: "À Venda" },
  { id: 2, nome: "Adamastor Prime", vendedor: "Sindicato Gama", preco: "800.000 EUR", status: "Vendido" },
  { id: 3, nome: "Éden Lusitano", vendedor: "Mercadores Independentes", preco: "250.000 EUR", status: "À Venda" },
];

function renderizarTabela() {
  const tbody = document.getElementById("tabela-planetas");
  tbody.innerHTML = "";

  registosDb.forEach(registo => {
    // Definir cor do status
    const statusColor = registo.status === "À Venda" ? "text-green-400" : "text-red-400";

    tbody.innerHTML += `
      <tr class="hover:bg-cyan-900/20 transition-colors">
        <td class="p-4 font-bold text-cyan-500">#${registo.id}</td>
        <td class="p-4">${registo.nome}</td>
        <td class="p-4">${registo.vendedor}</td>
        <td class="p-4 text-fuchsia-300">${registo.preco}</td>
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
  alert(`A iniciar protocolo de edição para o Registo #${id}...`);
  // Lógica de edição real aqui
}

function eliminarPlaneta(id) {
  if (confirm(`Aviso: Tem a certeza que deseja expurgar o Registo #${id} da base de dados?`)) {
    alert(`Registo #${id} eliminado com sucesso.`);
    // Lógica de eliminação real aqui (ex: filtrar o array e chamar renderizarTabela novamente)
  }
}

document.addEventListener("DOMContentLoaded", renderizarTabela);