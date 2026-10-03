let devedores = getDevedores();

function renderizarDevedores() {
  const lista = document.getElementById("devedores");
  lista.innerHTML = "";
  let totalGeral = 0;

  devedores.forEach((devedor) => {
    const item = document.createElement("li");
    item.classList.add("item-devedor");

    const linhaPrincipal = document.createElement("div");
    linhaPrincipal.classList.add("linha-principal");

    const nomeValor = document.createElement("span");
    nomeValor.textContent = `${devedor.nome} - R$ ${devedor.valor.toFixed(2)}`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarDevedor(devedor.id));

    const btnPagar = document.createElement("button");
    btnPagar.textContent = "Pagar";
    btnPagar.addEventListener("click", () => pagarDevedor(devedor.id));

    linhaPrincipal.appendChild(nomeValor);
    linhaPrincipal.appendChild(btnEditar);
    linhaPrincipal.appendChild(btnPagar);

    item.appendChild(linhaPrincipal);

    const historico = devedor.historico || [];
    historico.forEach((compra) => {
      const linhaDetalhe = document.createElement("div");
      linhaDetalhe.classList.add("linha-detalhe");
      linhaDetalhe.textContent = `${compra.data}${compra.itens ? " - " + compra.itens : ""} - R$ ${compra.valor.toFixed(2)}`;
      item.appendChild(linhaDetalhe);
    });

    lista.appendChild(item);
    totalGeral += devedor.valor;
  });

  document.getElementById("total-devedores").textContent = `R$ ${totalGeral.toFixed(2)}`;
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

  const dataHora = new Date().toLocaleString("pt-BR");
  const devedorExistente = devedores.find(
    (d) => d.nome.toLowerCase() === nome.toLowerCase()
  );

  if (devedorExistente) {
    devedorExistente.valor += valor;
    if (!devedorExistente.historico) devedorExistente.historico = [];
    devedorExistente.historico.push({ data: dataHora, itens: null, valor });
  } else {
    const novoId = devedores.length > 0 ? devedores[devedores.length - 1].id + 1 : 1;
    devedores.push({
      id: novoId,
      nome,
      valor,
      historico: [{ data: dataHora, itens: null, valor }],
    });
  }

  salvarDevedores(devedores);
  renderizarDevedores();
  e.target.reset();
});

renderizarDevedores();