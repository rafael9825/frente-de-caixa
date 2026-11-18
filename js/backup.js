function dataParaArquivo() {
  return new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
}

function baixarArquivoBackup(nomeArquivo) {
  const dados = {
    produtos: getProdutos(),
    vendas: getVendas(),
    devedores: getDevedores(),
    pagamentos: getPagamentos(),
    dataBackup: new Date().toLocaleString("pt-BR"),
  };

  const conteudo = JSON.stringify(dados, null, 2);
  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

function fazerBackupDiario() {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const ultimoBackup = localStorage.getItem("ultimoBackup");
  if (ultimoBackup === hoje) return;

  baixarArquivoBackup(`backup-frente-de-caixa-${dataParaArquivo()}.json`);
  localStorage.setItem("ultimoBackup", hoje);
}

function restaurarBackup(arquivo) {
  const leitor = new FileReader();

  leitor.onload = () => {
    let dados;

    try {
      dados = JSON.parse(leitor.result);
    } catch (erro) {
      alert("Arquivo inválido!");
      return;
    }

    if (
      !Array.isArray(dados.produtos) ||
      !Array.isArray(dados.vendas) ||
      !Array.isArray(dados.devedores)
    ) {
      alert("Esse arquivo não parece um backup do sistema!");
      return;
    }

    const confirmar = confirm(
      `Isso vai SUBSTITUIR todos os dados atuais pelo backup de ${dados.dataBackup || "data desconhecida"}.\n\n` +
        `Produtos: ${dados.produtos.length}\n` +
        `Vendas: ${dados.vendas.length}\n` +
        `Devedores: ${dados.devedores.length}\n\n` +
        `Antes de restaurar, vou baixar um backup dos dados atuais por segurança. Continuar?`
    );
    if (!confirmar) return;

    baixarArquivoBackup(`antes-de-restaurar-${dataParaArquivo()}.json`);

    salvarProdutos(dados.produtos);
    salvarVendas(dados.vendas);
    salvarDevedores(dados.devedores);
    salvarPagamentos(dados.pagamentos || []);

    alert("Backup restaurado!");
    setTimeout(() => location.reload(), 500);
  };

  leitor.readAsText(arquivo);
}

const btnBaixarBackup = document.getElementById("baixar-backup");
if (btnBaixarBackup) {
  btnBaixarBackup.addEventListener("click", () => {
    baixarArquivoBackup(`backup-frente-de-caixa-${dataParaArquivo()}.json`);
  });
}

const btnRestaurarBackup = document.getElementById("restaurar-backup");
if (btnRestaurarBackup) {
  btnRestaurarBackup.addEventListener("click", () => {
    const arquivo = document.getElementById("arquivo-backup").files[0];
    if (!arquivo) {
      alert("Escolha o arquivo de backup primeiro!");
      return;
    }
    restaurarBackup(arquivo);
  });
}

fazerBackupDiario();