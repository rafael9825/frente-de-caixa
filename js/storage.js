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

function registrarVenda(itens, total) {
  const vendas = getVendas();
  vendas.push({
    data: new Date().toISOString(),
    itens: itens,
    total: total,
  });
  salvarVendas(vendas);
}