if (localStorage.getItem("logado") !== "sim") {
  window.location.href = "login.html";
}

function sairDoSistema() {
  const confirmar = confirm("Deseja realmente sair?");
  if (!confirmar) return;
  localStorage.removeItem("logado");
  window.location.href = "login.html";
}