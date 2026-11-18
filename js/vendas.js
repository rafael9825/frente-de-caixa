let produtos = getProdutos();
let vendaAtual = [];

function totalDaVenda() {
  return vendaAtual.reduce((soma, item) => soma + item.preco * item.qtd, 0);
}

function renderizarProdutos() {
  const lista = document.getElementById("produtos");
  const termo = document.getElementById("busca-produto").value.toLowerCase();
  lista.innerHTML = "";

  produtos
    .filter((produto) => produto.nome.toLowerCase().includes(termo))
    .forEach((produto) => {
      const card = document.createElement("li");
      card.className = "card-produto";

      if (produto.quantidade <= 0) {
        card.classList.add("sem-estoque");
      }

      if (produto.imagem) {
        const foto = document.createElement("img");
        foto.src = produto.imagem;
        foto.alt = produto.nome;
        foto.className = "foto-card";
        card.appendChild(foto);
      }

      const nome = document.createElement("span");
      nome.className = "nome-card";
      nome.textContent = produto.nome;

      const preco = document.createElement("span");
      preco.className = "preco-card";
      preco.textContent = `R$ ${produto.preco.toFixed(2)}`;

      const estoque = document.createElement("span");
      estoque.className = "estoque-card";
      if (produto.quantidade <= 0) {
        estoque.textContent = "Esgotado";
        estoque.classList.add("esgotado");
      } else {
        estoque.textContent = `${produto.quantidade} em estoque`;
        if (produto.quantidade < 10) {
          estoque.classList.add("baixo");
        }
      }

      card.appendChild(nome);
      card.appendChild(preco);
      card.appendChild(estoque);
      card.addEventListener("click", () => adicionarNaVenda(produto.id));

      lista.appendChild(card);
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
    vendaAtual.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria || "",
      qtd: 1,
    });
  }

  renderizarVenda();
}

function renderizarVenda() {
  const lista = document.getElementById("itens-venda");
  lista.innerHTML = "";

  vendaAtual.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item-carrinho";

    const nome = document.createElement("span");
    nome.className = "nome-item";
    nome.textContent = `${item.nome} x${item.qtd}`;

    const preco = document.createElement("span");
    preco.className = "preco-item";
    preco.textContent = `R$ ${(item.preco * item.qtd).toFixed(2)}`;

    const btnRemover = document.createElement("button");
    btnRemover.className = "btn-remover";
    btnRemover.textContent = "✕";
    btnRemover.title = "Remover item";
    btnRemover.addEventListener("click", () => {
      vendaAtual.splice(index, 1);
      renderizarVenda();
    });

    li.appendChild(nome);
    li.appendChild(preco);
    li.appendChild(btnRemover);
    lista.appendChild(li);
  });

  document.getElementById("total-venda").textContent = `R$ ${totalDaVenda().toFixed(2)}`;
  atualizarTroco();
}

function atualizarTroco() {
  const campo = document.getElementById("valor-recebido");
  const saida = document.getElementById("troco-venda");
  const eFiado = document.getElementById("venda-fiado").checked;
  const total = totalDaVenda();

  campo.disabled = eFiado;
  saida.classList.remove("faltando");

  if (eFiado) {
    campo.value = "";
    saida.textContent = "—";
    return;
  }

  const recebido = parseFloat(campo.value);

  if (isNaN(recebido) || total === 0) {
    saida.textContent = "R$ 0.00";
    return;
  }

  const diferenca = Math.round((recebido - total) * 100) / 100;

  if (diferenca < 0) {
    saida.textContent = `Faltam R$ ${Math.abs(diferenca).toFixed(2)}`;
    saida.classList.add("faltando");
  } else {
    saida.textContent = `R$ ${diferenca.toFixed(2)}`;
  }
}

document.getElementById("valor-recebido").addEventListener("input", atualizarTroco);
document.getElementById("venda-fiado").addEventListener("change", atualizarTroco);

document.getElementById("limpar-venda").addEventListener("click", () => {
  if (vendaAtual.length === 0) return;
  const confirmar = confirm("Limpar toda a venda atual?");
  if (!confirmar) return;
  vendaAtual = [];
  document.getElementById("valor-recebido").value = "";
  renderizarVenda();
});

document.getElementById("finalizar-venda").addEventListener("click", finalizarVenda);

function finalizarVenda() {
  if (vendaAtual.length === 0) {
    alert("Nenhum item na venda!");
    return;
  }

  const eFiado = document.getElementById("venda-fiado").checked;
  const total = totalDaVenda();
  let devedorNome = null;

  if (eFiado) {
    devedorNome = prompt("Nome do devedor:");
    if (!devedorNome || devedorNome.trim() === "") {
      alert("Digite o nome do devedor!");
      return;
    }
    devedorNome = devedorNome.trim();
  } else {
    const recebido = parseFloat(document.getElementById("valor-recebido").value);
    if (!isNaN(recebido) && recebido < total) {
      const continuar = confirm("O valor recebido é menor que o total. Finalizar mesmo assim?");
      if (!continuar) return;
    }
  }

  vendaAtual.forEach((item) => {
    const produto = produtos.find((p) => p.id === item.id);
    produto.quantidade -= item.qtd;
  });

  salvarProdutos(produtos);
  registrarVenda(vendaAtual, total, eFiado ? "fiado" : "avista", devedorNome);

  if (eFiado) {
    const devedores = getDevedores();
    const devedorExistente = devedores.find(
      (d) => d.nome.toLowerCase() === devedorNome.toLowerCase()
    );

    const itensComprados = vendaAtual.map((item) => ({
      nome: item.nome,
      preco: item.preco,
      qtd: item.qtd,
    }));
    const dataHora = new Date().toLocaleString("pt-BR");
    const compra = { data: dataHora, itens: itensComprados, valor: total };

    if (devedorExistente) {
      devedorExistente.valor += total;
      devedorExistente.historico.push(compra);
    } else {
      const novoId = devedores.length > 0 ? devedores[devedores.length - 1].id + 1 : 1;
      devedores.push({
        id: novoId,
        nome: devedorNome,
        valor: total,
        historico: [compra],
      });
    }

    salvarDevedores(devedores);
  }

  alert("Venda finalizada!");
  vendaAtual = [];
  document.getElementById("venda-fiado").checked = false;
  document.getElementById("valor-recebido").value = "";
  renderizarVenda();
  renderizarProdutos();
}

renderizarProdutos();
renderizarVenda();