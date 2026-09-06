let produtos = getProdutos();
let vendaAtual = [];

function renderizarProdutos() {
  const lista = document.getElementById("produtos");
  const termo = document.getElementById("busca-produto").value.toLowerCase();
  lista.innerHTML = "";

  produtos
    .filter((produto) => produto.nome.toLowerCase().includes(termo))
    .forEach((produto) => {
      const item = document.createElement("li");
      item.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (${produto.quantidade} em estoque)`;

      const btn = document.createElement("button");
      btn.textContent = "Adicionar";
      btn.addEventListener("click", () => adicionarNaVenda(produto.id));

      item.appendChild(btn);
      lista.appendChild(item);
    });
}

document.getElementById("busca-produto").addEventListener("input", renderizarProdutos);

function adicionarNaVenda(id) {
  const produto = produtos.find((p) => p.id === id);

  if (produto.quantidade <= 0) {
    alert("Produto sem estoque!");
    return;
  }

  const itemVenda = vendaAtual.find((i) => i.id === id);

  if (itemVenda) {
    itemVenda.qtd++;
  } else {
    vendaAtual.push({ id: produto.id, nome: produto.nome, preco: produto.preco, qtd: 1 });
  }

  renderizarVenda();
}

function renderizarVenda() {
  const lista = document.getElementById("itens-venda");
  lista.innerHTML = "";
  let total = 0;

  vendaAtual.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} x${item.qtd} - R$ ${(item.preco * item.qtd).toFixed(2)}`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", () => {
      vendaAtual.splice(index, 1);
      renderizarVenda();
    });

    li.appendChild(btnRemover);
    lista.appendChild(li);
    total += item.preco * item.qtd;
  });

  document.getElementById("total-venda").textContent = `R$ ${total.toFixed(2)}`;
}

document.getElementById("limpar-venda").addEventListener("click", () => {
  if (vendaAtual.length === 0) return;
  const confirmar = confirm("Limpar toda a venda atual?");
  if (!confirmar) return;
  vendaAtual = [];
  renderizarVenda();
});

document.getElementById("finalizar-venda").addEventListener("click", finalizarVenda);

function finalizarVenda() {
  if (vendaAtual.length === 0) {
    alert("Nenhum item na venda!");
    return;
  }

  let total = 0;
  vendaAtual.forEach((item) => {
    const produto = produtos.find((p) => p.id === item.id);
    produto.quantidade -= item.qtd;
    total += item.preco * item.qtd;
  });

  salvarProdutos(produtos);
  registrarVenda(vendaAtual, total);

  alert("Venda finalizada!");
  vendaAtual = [];
  renderizarVenda();
  renderizarProdutos();
}

renderizarProdutos();