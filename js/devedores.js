let devedores = getDevedores();

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function removerSeQuitado(devedor) {
  if (devedor.historico.length === 0 || devedor.valor <= 0) {
    devedores = devedores.filter((d) => d.id !== devedor.id);
  }
}

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

    const btnPagarParte = document.createElement("button");
    btnPagarParte.textContent = "Pagar parte";
    btnPagarParte.addEventListener("click", () => pagarParte(devedor.id));

    const btnPagar = document.createElement("button");
    btnPagar.textContent = "Pagar tudo";
    btnPagar.addEventListener("click", () => pagarDevedor(devedor.id));

    linhaPrincipal.appendChild(nomeValor);
    linhaPrincipal.appendChild(btnEditar);
    linhaPrincipal.appendChild(btnPagarParte);
    linhaPrincipal.appendChild(btnPagar);

    item.appendChild(linhaPrincipal);

    devedor.historico.forEach((compra, indexCompra) => {
      const linhaDetalhe = document.createElement("div");
      linhaDetalhe.classList.add("linha-detalhe");

      const data = document.createElement("span");
      data.textContent = `${compra.data} -`;
      linhaDetalhe.appendChild(data);

      if (Array.isArray(compra.itens)) {
        compra.itens.forEach((produto, indexItem) => {
          const chip = document.createElement("span");
          chip.classList.add("item-comprado");
          chip.textContent = `${produto.nome} x${produto.qtd}`;

          const btnExcluir = document.createElement("button");
          btnExcluir.textContent = "✕";
          btnExcluir.classList.add("btn-excluir-item");
          btnExcluir.title = "Excluir este item";
          btnExcluir.addEventListener("click", () =>
            excluirItem(devedor.id, indexCompra, indexItem)
          );

          chip.appendChild(btnExcluir);
          linhaDetalhe.appendChild(chip);
        });
      } else {
        const chip = document.createElement("span");
        chip.classList.add("item-comprado");
        chip.textContent = `${compra.itens ? compra.itens + " - " : ""}R$ ${compra.valor.toFixed(2)}`;

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "✕";
        btnExcluir.classList.add("btn-excluir-item");
        btnExcluir.title = "Excluir esta compra";
        btnExcluir.addEventListener("click", () => excluirCompra(devedor.id, indexCompra));

        chip.appendChild(btnExcluir);
        linhaDetalhe.appendChild(chip);
      }

      item.appendChild(linhaDetalhe);
    });

    (devedor.pagamentos || []).forEach((pagamento) => {
      const linhaPagamento = document.createElement("div");
      linhaPagamento.classList.add("linha-detalhe", "linha-pagamento");
      linhaPagamento.textContent = `${pagamento.data} - Pagou R$ ${pagamento.valor.toFixed(2)}`;
      item.appendChild(linhaPagamento);
    });

    lista.appendChild(item);
    totalGeral += devedor.valor;
  });

  document.getElementById("total-devedores").textContent = `R$ ${totalGeral.toFixed(2)}`;
}

function excluirItem(idDevedor, indexCompra, indexItem) {
  const devedor = devedores.find((d) => d.id === idDevedor);
  const compra = devedor.historico[indexCompra];
  const produto = compra.itens[indexItem];
  const valorItem = produto.preco * produto.qtd;

  const confirmar = confirm(
    `Remover "${produto.nome} x${produto.qtd}" (R$ ${valorItem.toFixed(2)}) de ${devedor.nome}?`
  );
  if (!confirmar) return;

  compra.itens.splice(indexItem, 1);
  compra.valor = arredondar(compra.valor - valorItem);
  devedor.valor = arredondar(devedor.valor - valorItem);

  if (compra.itens.length === 0) {
    devedor.historico.splice(indexCompra, 1);
  }

  removerSeQuitado(devedor);
  salvarDevedores(devedores);
  renderizarDevedores();
}

function excluirCompra(idDevedor, indexCompra) {
  const devedor = devedores.find((d) => d.id === idDevedor);
  const compra = devedor.historico[indexCompra];

  const confirmar = confirm(
    `Remover R$ ${compra.valor.toFixed(2)} (${compra.data}) de ${devedor.nome}?`
  );
  if (!confirmar) return;

  devedor.valor = arredondar(devedor.valor - compra.valor);
  devedor.historico.splice(indexCompra, 1);

  removerSeQuitado(devedor);
  salvarDevedores(devedores);
  renderizarDevedores();
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

function pagarParte(id) {
  const devedor = devedores.find((d) => d.id === id);

  const resposta = prompt(
    `Quanto ${devedor.nome} pagou? (deve R$ ${devedor.valor.toFixed(2)})`
  );
  if (resposta === null) return;

  const valorPago = parseFloat(resposta.replace(",", "."));
  if (isNaN(valorPago) || valorPago <= 0) {
    alert("Valor inválido!");
    return;
  }

  if (valorPago >= devedor.valor) {
    const confirmar = confirm(
      `Esse valor quita toda a dívida de "${devedor.nome}". Confirmar pagamento total?`
    );
    if (!confirmar) return;

    registrarPagamento(devedor.nome, devedor.valor);
    devedores = devedores.filter((d) => d.id !== id);
  } else {
    if (!devedor.pagamentos) devedor.pagamentos = [];
    devedor.pagamentos.push({
      data: new Date().toLocaleString("pt-BR"),
      valor: valorPago,
    });
    devedor.valor = arredondar(devedor.valor - valorPago);
    registrarPagamento(devedor.nome, valorPago);
  }

  salvarDevedores(devedores);
  renderizarDevedores();
}

function pagarDevedor(id) {
  const devedor = devedores.find((d) => d.id === id);
  const confirmar = confirm(`Confirmar pagamento total de "${devedor.nome}"?`);
  if (!confirmar) return;

  registrarPagamento(devedor.nome, devedor.valor);
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
  const compra = { data: dataHora, itens: null, valor };

  const devedorExistente = devedores.find(
    (d) => d.nome.toLowerCase() === nome.toLowerCase()
  );

  if (devedorExistente) {
    devedorExistente.valor += valor;
    devedorExistente.historico.push(compra);
  } else {
    const novoId = devedores.length > 0 ? devedores[devedores.length - 1].id + 1 : 1;
    devedores.push({ id: novoId, nome, valor, historico: [compra] });
  }

  salvarDevedores(devedores);
  renderizarDevedores();
  e.target.reset();
});

renderizarDevedores();