function getProdutos() {
  const dados = localStorage.getItem("produtos");
  if (dados) {
    return JSON.parse(dados);
  }
  const padrao = [];
  salvarProdutos(padrao);
  return padrao;
}

function salvarProdutos(produtos) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function getVendas() {
  const dados = localStorage.getItem("vendas");
  if (dados) {
    return JSON.parse(dados);
  }
  return [];
}

function salvarVendas(vendas) {
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function registrarVenda(itens, total, formaPagamento, devedorNome) {
  const vendas = getVendas();
  vendas.push({
    data: new Date().toISOString(),
    itens: itens,
    total: total,
    formaPagamento: formaPagamento || "dinheiro",
    devedorNome: devedorNome || null,
  });
  salvarVendas(vendas);
}

function getDevedores() {
  const dados = localStorage.getItem("devedores");
  if (!dados) {
    return [];
  }

  const lista = JSON.parse(dados);
  let mudou = false;

  lista.forEach((d) => {
    if (!d.historico) {
      d.historico = [{ data: d.data, itens: d.itens || null, valor: d.valor }];
      delete d.data;
      delete d.itens;
      mudou = true;
    }
  });

  if (mudou) {
    salvarDevedores(lista);
  }

  return lista;
}

function salvarDevedores(devedores) {
  localStorage.setItem("devedores", JSON.stringify(devedores));
}

function getPagamentos() {
  const dados = localStorage.getItem("pagamentos");
  if (dados) {
    return JSON.parse(dados);
  }
  return [];
}

function salvarPagamentos(pagamentos) {
  localStorage.setItem("pagamentos", JSON.stringify(pagamentos));
}

function registrarPagamento(nome, valor) {
  const pagamentos = getPagamentos();
  pagamentos.push({
    data: new Date().toISOString(),
    nome: nome,
    valor: valor,
  });
  salvarPagamentos(pagamentos);
}