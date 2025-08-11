
function validarForm() {
  const form = document.getElementById('login'); // ou 'form-cadastro'

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirm').value;

                              
    let usuarios = JSON.parse(localStorage.getItem('usuarioCadastrado') || '[]');
    
    const emailLimpo = email.trim().toLowerCase();
    
    if (nome === '' || email === '' || senha === '' || senha !== confirmarSenha) {
      alert("Preencha todos os dados corretamente e verifique se as senhas coincidem");
      return;
    }
else if (usuarios.some(u => u.email.trim().toLowerCase() === emailLimpo)) {
  alert('Email já cadastrado em outra conta.');
  return;
}



    const novoUsuario = { 
      id: usuarios.length + 1,
      nome,
      email,
      telefone,
      senha,
      tipoConta: 'cliente'
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarioCadastrado', JSON.stringify(usuarios));
    alert("Usuário cadastrado com sucesso!");
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
