function fazerBackupDiario() {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const ultimoBackup = localStorage.getItem("ultimoBackup");

  if (ultimoBackup === hoje) return;

  const dados = {
    produtos: getProdutos(),
    vendas: getVendas(),
    devedores: getDevedores(),
    dataBackup: new Date().toLocaleString("pt-BR"),
  };

  const conteudo = JSON.stringify(dados, null, 2);
  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `backup-frente-de-caixa-${hoje.replace(/\//g, "-")}.json`;
  link.click();

  URL.revokeObjectURL(url);
  localStorage.setItem("ultimoBackup", hoje);
}

fazerBackupDiario();