let produtos = getProdutos();

function capitalizarNome(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

function renderizarProdutos() {
  const lista = document.getElementById("produtos");
  const termo = document.getElementById("busca-produto").value.toLowerCase();
  lista.innerHTML = "";

  produtos
    .filter((produto) => produto.nome.toLowerCase().includes(termo))
    .forEach((produto) => {
      const item = document.createElement("li");

      if (produto.imagem) {
        const img = document.createElement("img");
        img.src = produto.imagem;
        img.className = "foto-produto";
        item.appendChild(img);
      }

      const texto = document.createElement("span");
      let info = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (${produto.quantidade} em estoque)`;
      if (produto.categoria) info += ` | ${produto.categoria}`;
      if (produto.fornecedor) info += ` | Forn: ${produto.fornecedor}`;
      texto.textContent = info;

      if (produto.quantidade < 10) {
        texto.classList.add("estoque-baixo");
        texto.textContent += " ⚠ Estoque baixo!";
      }

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => editarProduto(produto.id));

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.addEventListener("click", () => removerProduto(produto.id));

      item.appendChild(texto);
      item.appendChild(btnEditar);
      item.appendChild(btnRemover);
      lista.appendChild(item);
    });
}

document.getElementById("busca-produto").addEventListener("input", renderizarProdutos);

function editarProduto(id) {
  const produto = produtos.find((p) => p.id === id);

  const novoNome = prompt("Nome do produto:", produto.nome);
  if (novoNome === null) return;

  const novoPreco = prompt("Preço unitário:", produto.preco);
  if (novoPreco === null) return;

  const novaQuantidade = prompt("Quantidade em estoque:", produto.quantidade);
  if (novaQuantidade === null) return;

  const novaCategoria = prompt("Categoria:", produto.categoria || "");
  if (novaCategoria === null) return;

  const novoFornecedor = prompt("Fornecedor:", produto.fornecedor || "");
  if (novoFornecedor === null) return;

  produto.nome = capitalizarNome(novoNome);
  produto.preco = parseFloat(novoPreco);
  produto.quantidade = parseInt(novaQuantidade);
  produto.categoria = novaCategoria;
  produto.fornecedor = novoFornecedor;

  salvarProdutos(produtos);
  renderizarProdutos();
}

function removerProduto(id) {
  const produto = produtos.find((p) => p.id === id);
  const confirmar = confirm(`Remover "${produto.nome}"?`);
  if (!confirmar) return;

  produtos = produtos.filter((p) => p.id !== id);
  salvarProdutos(produtos);
  renderizarProdutos();
}

document.getElementById("form-produto").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = capitalizarNome(document.getElementById("nome-produto").value.trim());
  const preco = parseFloat(document.getElementById("preco-produto").value);
  const quantidade = parseInt(document.getElementById("qtd-produto").value);
  const categoria = document.getElementById("categoria-produto").value.trim();
  const fornecedor = document.getElementById("fornecedor-produto").value.trim();
  const arquivoImagem = document.getElementById("imagem-produto").files[0];

  if (nome === "") {
    alert("Digite o nome do produto!");
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Preço inválido!");
    return;
  }

  if (isNaN(quantidade) || quantidade < 0) {
    alert("Quantidade inválida!");
    return;
  }

  function salvarProduto(imagemBase64) {
    const novoId = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;

    produtos.push({ id: novoId, nome, preco, quantidade, categoria, fornecedor, imagem: imagemBase64 || null });
    salvarProdutos(produtos);

    renderizarProdutos();
    document.getElementById("form-produto").reset();
  }

  if (arquivoImagem) {
    const leitor = new FileReader();
    leitor.onload = () => salvarProduto(leitor.result);
    leitor.readAsDataURL(arquivoImagem);
  } else {
    salvarProduto(null);
  }
});

renderizarProdutos();