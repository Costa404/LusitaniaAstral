const API_URL = "https://api.exemplo.com/planetas";

const RECURSOS = [
  // Fauna
  "terrestre",
  "aviario",
  "aquatico",
  "marisco",
  "insetos",
  // Flora
  "madeireira",
  "ornamental",
  // Geologia
  "minerio",
  "gas",
  "liquido",
];

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("id");
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function normalizarListaSeparadaPorVirgulas(valor) {
  return String(valor || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function setAlerta({ tipo, mensagem }) {
  const el = document.getElementById("alerta");
  if (!mensagem) {
    el.className = "hidden mb-5 border px-4 py-3 font-tech text-sm";
    el.textContent = "";
    return;
  }

  const base = "mb-5 border px-4 py-3 font-tech text-sm";
  if (tipo === "sucesso") {
    el.className = `${base} border-green-700/60 bg-green-950/30 text-green-200`;
  } else {
    el.className = `${base} border-red-700/60 bg-red-950/30 text-red-200`;
  }
  el.textContent = mensagem;
}

function setErros({ nome, preco, recursos }) {
  const erroNome = document.getElementById("erro-nome");
  const erroPreco = document.getElementById("erro-preco");
  const erroRecursos = document.getElementById("erro-recursos");

  erroNome.classList.toggle("hidden", !nome);
  erroPreco.classList.toggle("hidden", !preco);
  if (erroRecursos) erroRecursos.classList.toggle("hidden", !recursos);
}

function validar({ nome, preco, recursos }) {
  const nomeOk = String(nome || "").trim().length > 0;
  const precoNum = Number(preco);
  const precoOk = Number.isFinite(precoNum) && precoNum >= 0;

  const listaRecursos = normalizarListaSeparadaPorVirgulas(recursos);
  const recursosOk =
    listaRecursos.length === 0 ||
    listaRecursos.every((r) => RECURSOS.includes(r.toLowerCase()));

  setErros({
    nome: !nomeOk,
    preco: !precoOk,
    recursos: !recursosOk,
  });

  return nomeOk && precoOk && recursosOk;
}

function preencherForm(planeta) {
  document.getElementById("nome").value = planeta?.nome ?? "";
  document.getElementById("vendedor").value = planeta?.vendedor ?? "";
  document.getElementById("preco").value =
    planeta?.preco === 0 || planeta?.preco ? String(planeta.preco) : "";
  document.getElementById("status").value = planeta?.status ?? "À Venda";
  document.getElementById("galaxia").value = planeta?.galaxia ?? "";

  const recursos = Array.isArray(planeta?.recursos) ? planeta.recursos.join(", ") : planeta?.recursos ?? "";
  document.getElementById("recursos").value = recursos;

  const fotos = Array.isArray(planeta?.fotos) ? planeta.fotos.join(", ") : planeta?.fotos ?? "";
  document.getElementById("fotos").value = fotos;
}

async function carregarPlanetaParaEdicao(id) {
  const titulo = document.getElementById("titulo-registo");
  titulo.textContent = `Edição de Registo #${id}`;

  setAlerta({ tipo: "erro", mensagem: "" });
  try {
    const resposta = await fetch(`${API_URL}/${encodeURIComponent(String(id))}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!resposta.ok) throw new Error(`GET falhou (${resposta.status})`);
    const planeta = await resposta.json();
    preencherForm(planeta);
  } catch (e) {
    console.error(e);
    setAlerta({
      tipo: "erro",
      mensagem:
        "Falha ao carregar o registo para edição. Confirma o endpoint da API e volta a tentar.",
    });
  }
}

async function submeterForm({ id, payload }) {
  const isEdicao = id !== null;
  const method = isEdicao ? "PATCH" : "POST";
  const url = isEdicao ? `${API_URL}/${encodeURIComponent(String(id))}` : API_URL;

  const resposta = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(`${method} falhou (${resposta.status}) ${detalhe}`.trim());
  }

  return resposta.json().catch(() => null);
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getIdFromUrl();
  if (id !== null) void carregarPlanetaParaEdicao(id);

  const form = document.getElementById("form-registo");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    setAlerta({ tipo: "erro", mensagem: "" });

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const recursosRaw = document.getElementById("recursos").value;

    if (!validar({ nome, preco, recursos: recursosRaw })) return;

    const payload = {
      nome: String(nome).trim(),
      vendedor: String(document.getElementById("vendedor").value || "").trim(),
      preco: Number(preco),
      status: document.getElementById("status").value,
      galaxia: String(document.getElementById("galaxia").value || "").trim(),
      recursos: normalizarListaSeparadaPorVirgulas(recursosRaw).map((r) => r.toLowerCase()),
      fotos: normalizarListaSeparadaPorVirgulas(document.getElementById("fotos").value),
    };

    const btn = document.getElementById("btn-submit");
    const antigo = btn.textContent;
    btn.disabled = true;
    btn.textContent = "A Guardar...";

    try {
      await submeterForm({ id, payload });
      setAlerta({
        tipo: "sucesso",
        mensagem: "Registo guardado com sucesso.",
      });
      setTimeout(() => {
        window.location.href = "gestao.html";
      }, 600);
    } catch (e) {
      console.error(e);
      setAlerta({
        tipo: "erro",
        mensagem:
          "Não foi possível guardar o registo. Verifica a API/endpoint e confirma os dados.",
      });
    } finally {
      btn.disabled = false;
      btn.textContent = antigo;
    }
  });
});

