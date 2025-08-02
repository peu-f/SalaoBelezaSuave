document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const valorLogin = document.getElementById("login").value.trim(); // Pode ser e-mail ou telefone
  const valorSenha = document.getElementById("senha").value;

  const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

  if (
    usuario &&
    (usuario.email === valorLogin || usuario.telefone === valorLogin) &&
    usuario.senha === valorSenha
  ) {
    window.location.href = "../aHome/home.html";
  } else {
    alert("Email/Celular ou senha incorretos.");
  } 
});