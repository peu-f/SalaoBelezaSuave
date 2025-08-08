// Informações do salão
window.addEventListener("DOMContentLoaded", () => {
  const saloesSalvos = JSON.parse(localStorage.getItem("saloes") || "[]");

  // Se ainda não existe nenhum salão salvo, cria um
  if (saloesSalvos.length === 0) {
    const salaoPadrao = {
      nome: "Beleza Suave",
      email: "contato@belezasuave.com",
      telefone: "(88) 99999-9999",
      senha: "salao123", // senha padrão pra teste
      tipoConta: "salao",
    };

    localStorage.setItem("saloes", JSON.stringify([salaoPadrao]));
    console.log("Salão cadastrado automaticamente no localStorage.");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", processarLogin);
});

function processarLogin(event) {
  event.preventDefault();

  const valorLogin = document.getElementById("login").value.trim();
  const valorSenha = document.getElementById("senha").value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarioCadastrado") || "[]");
  const profissionais = JSON.parse(localStorage.getItem("profissionais") || "[]");
  const saloes = JSON.parse(localStorage.getItem("saloes") || "[]");

  const campoEhTelefone = valorLogin.startsWith("(");

  const encontrarUsuario = (lista, tipo) => {
    return lista.find((u) => {
      const loginCorreto = campoEhTelefone
        ? u.telefone === valorLogin
        : u.email === valorLogin;
      return loginCorreto && u.senha === valorSenha && u.tipoConta === tipo;
    });
  };

  const usuario = encontrarUsuario(usuarios, "cliente");
  const profissional = encontrarUsuario(profissionais, "profissional");
  const salao = encontrarUsuario(saloes, "salao");

  if (usuario) {
    alert(`Bem-vindo(a), ${usuario.nome || "cliente"}!`);
    window.location.href = "../aHome/home.html";
  } else if (profissional) {

    localStorage.setItem("profissionalLogado", JSON.stringify(profissional));

    alert(`Bem-vindo(a), ${profissional.nome || "profissional"}!`);
    window.location.href = "../../Profissional/Atribuidos.html";
  } else if (salao) {



    alert(`Bem-vindo(a), ${salao.nome || "salão"}!`);
    window.location.href = "../../Salão/Sinicio/Salao.html";
  } else {
    alert("Login ou senha inválidos.");
  }
}


function mascararTelefone(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11); // Limita 11 dígitos

  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    value = value.replace(/^(\d*)/, '($1');
  }

  input.value = value;
}
