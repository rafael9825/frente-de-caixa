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
    formaPagamento: formaPagamento || "avista",
    devedorNome: devedorNome || null,
  });
  salvarVendas(vendas);
}

function getDevedores() {
  const dados = localStorage.getItem("devedores");
  if (dados) {
    return JSON.parse(dados);
  }
  return [];
}

function salvarDevedores(devedores) {
  localStorage.setItem("devedores", JSON.stringify(devedores));
}