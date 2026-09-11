let devedores = getDevedores();

function renderizarDevedores() {
  const lista = document.getElementById("devedores");
  lista.innerHTML = "";

  devedores.forEach((devedor) => {
    const item = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = `${devedor.nome} - R$ ${devedor.valor.toFixed(2)} - ${devedor.data}`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarDevedor(devedor.id));

    const btnPagar = document.createElement("button");
    btnPagar.textContent = "Pagar";
    btnPagar.addEventListener("click", () => pagarDevedor(devedor.id));

    item.appendChild(texto);
    item.appendChild(btnEditar);
    item.appendChild(btnPagar);
    lista.appendChild(item);
  });
}

function editarDevedor(id) {
  const devedor = devedores.find((d) => d.id === id);

  const novoNome = prompt("Nome do devedor:", devedor.nome);
  if (novoNome === null) return;

  const novoValor = prompt("Valor devido:", devedor.valor);
  if (novoValor === null) return;

  devedor.nome = novoNome;
  devedor.valor = parseFloat(novoValor);

  salvarDevedores(devedores);
  renderizarDevedores();
}

function pagarDevedor(id) {
  const devedor = devedores.find((d) => d.id === id);
  const confirmar = confirm(`Confirmar pagamento de "${devedor.nome}"?`);
  if (!confirmar) return;

  devedores = devedores.filter((d) => d.id !== id);
  salvarDevedores(devedores);
  renderizarDevedores();
}

document.getElementById("form-devedor").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome-devedor").value.trim();
  const valor = parseFloat(document.getElementById("valor-devedor").value);

  if (nome === "") {
    alert("Digite o nome do devedor!");
    return;
  }

  if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
  }

  const novoId = devedores.length > 0 ? devedores[devedores.length - 1].id + 1 : 1;
  const dataHora = new Date().toLocaleString("pt-BR");

  devedores.push({ id: novoId, nome, valor, data: dataHora });
  salvarDevedores(devedores);

  renderizarDevedores();
  e.target.reset();
});

renderizarDevedores();