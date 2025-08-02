document.addEventListener("DOMContentLoaded", validarForm);

function validarForm() {
  const form = document.getElementById('login'); // ou 'form-cadastro'

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirm').value;

    if (nome === '' || email === '' || senha === '' || senha !== confirmarSenha) {
      alert("Preencha todos os dados corretamente e verifique se as senhas coincidem");
      return;
    }
    alert("Usuário cadastrado com sucesso!");
    const usuario = { 
      nome,
      email,
      telefone,
      senha,
      tipoConta: 'cliente'
    };

    localStorage.setItem('usuarioCadastrado', JSON.stringify(usuario));
    window.location.href = "../aHome/home.html";

    
  });
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
