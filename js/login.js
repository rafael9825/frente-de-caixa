const USUARIO_CORRETO = "Gis@Lim@";
const SENHA_CORRETA = "9825G&sA";

document.getElementById("avatar").addEventListener("click", () => {
  document.getElementById("tela-boas-vindas").classList.add("escondido");
  document.getElementById("form-login").classList.remove("escondido");
});

document.getElementById("form-login").addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erro = document.getElementById("mensagem-erro");

  if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
    localStorage.setItem("logado", "sim");
    window.location.href = "index.html";
  } else {
    erro.classList.add("mostrar");
  }
});