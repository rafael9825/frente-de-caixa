let periodoAtual = "dia";

document.querySelectorAll("#filtro-periodo button").forEach((btn) => {
  btn.addEventListener("click", () => {
    periodoAtual = btn.dataset.periodo;
    renderizarRelatorio();
  });
});

function estaNoPeriodo(dataVenda, periodo) {
  const agora = new Date();
  const data = new Date(dataVenda);

  if (periodo === "dia") {
    return data.toDateString() === agora.toDateString();
  }

  if (periodo === "semana") {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(agora.getDate() - 7);
    return data >= seteDiasAtras;
  }

  if (periodo === "mes") {
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  }

  return false;
}

function renderizarRelatorio() {
  const vendas = getVendas();
  const vendasFiltradas = vendas.filter((v) => estaNoPeriodo(v.data, periodoAtual));

  let totalGeral = 0;
  let totalAVista = 0;
  let totalFiado = 0;
  const produtosVendidos = {};

  vendasFiltradas.forEach((venda) => {
    totalGeral += venda.total;

    if (venda.formaPagamento === "fiado") {
      totalFiado += venda.total;
    } else {
      totalAVista += venda.total;
    }

    venda.itens.forEach((item) => {
      if (!produtosVendidos[item.nome]) {
        produtosVendidos[item.nome] = { qtd: 0, total: 0 };
      }
      produtosVendidos[item.nome].qtd += item.qtd;
      produtosVendidos[item.nome].total += item.preco * item.qtd;
    });
  });

  document.getElementById("total-periodo").textContent = `R$ ${totalGeral.toFixed(2)}`;
  document.getElementById("qtd-vendas").textContent = vendasFiltradas.length;

  document.getElementById("total-avista").textContent = `R$ ${totalAVista.toFixed(2)}`;
  document.getElementById("total-fiado").textContent = `R$ ${totalFiado.toFixed(2)}`;
  document.getElementById("total-geral").textContent = `R$ ${totalGeral.toFixed(2)}`;

  const lista = document.getElementById("lista-produtos-vendidos");
  lista.innerHTML = "";

  Object.keys(produtosVendidos).forEach((nome) => {
    const dados = produtosVendidos[nome];
    const li = document.createElement("li");
    li.textContent = `${nome} - ${dados.qtd} unidades - R$ ${dados.total.toFixed(2)}`;
    lista.appendChild(li);
  });

  if (Object.keys(produtosVendidos).length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma venda nesse período.";
    lista.appendChild(li);
  }
}

document.getElementById("exportar-pdf").addEventListener("click", () => {
  const vendas = getVendas();
  const vendasFiltradas = vendas.filter((v) => estaNoPeriodo(v.data, periodoAtual));

  if (vendasFiltradas.length === 0) {
    alert("Nenhuma venda para exportar nesse período!");
    return;
  }

  let totalGeral = 0;
  let linhas = "";

  vendasFiltradas.forEach((venda) => {
    totalGeral += venda.total;
    const data = new Date(venda.data).toLocaleString("pt-BR");
    venda.itens.forEach((item) => {
      const subtotal = (item.preco * item.qtd).toFixed(2);
      linhas += `<tr>
        <td>${data}</td>
        <td>${item.nome}</td>
        <td>${item.qtd}</td>
        <td>R$ ${item.preco.toFixed(2)}</td>
        <td>R$ ${subtotal}</td>
      </tr>`;
    });
  });

  const nomesPeriodo = { dia: "Hoje", semana: "Semana", mes: "Mês" };

  const janela = window.open("", "_blank");
  janela.document.write(`
    <html>
    <head>
      <title>Relatório de Vendas</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h1 { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #2563eb; color: #fff; }
        .total { margin-top: 16px; font-size: 18px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Relatório de Vendas - ${nomesPeriodo[periodoAtual]}</h1>
      <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
      <p class="total">Total: R$ ${totalGeral.toFixed(2)}</p>
    </body>
    </html>
  `);
  janela.document.close();
  janela.print();
});

renderizarRelatorio();