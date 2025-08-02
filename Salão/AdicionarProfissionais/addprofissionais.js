const form = document.getElementById('addProfessionalForm');
const fotoInput = document.getElementById('fotoPerfil');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');

// Preview de imagem reaproveitável
function mostrarPreviewImagem(file) {
  if (!file) {
    previewImage.style.display = 'none';
    fileName.textContent = 'Nenhuma foto selecionada';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
    fileName.textContent = file.name;
  };
  reader.readAsDataURL(file);
}

// Evento de mudança no input de imagem
fotoInput.addEventListener('change', function () {
  mostrarPreviewImagem(this.files[0]);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const especialidade = document.getElementById('especialidade').value.trim();
  const horaInicio = document.getElementById('horaInicio').value;
  const horaFim = document.getElementById('horaFim').value;
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const file = fotoInput.files[0];

  // Validação de campos obrigatórios
  if (!nome || !especialidade || !horaInicio || !horaFim || !email || !telefone || !senha) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Validação básica de horário
  if (horaInicio >= horaFim) {
    alert('A hora de início deve ser menor que a hora de fim.');
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      salvarProfissional(nome, especialidade, horaInicio, horaFim, email, telefone, senha, e.target.result);
      resetarForm();
    };
    reader.readAsDataURL(file);
  } else {
    salvarProfissional(nome, especialidade, horaInicio, horaFim, email, telefone, senha, null);
    resetarForm();
  }
});

function resetarForm() {
  form.reset();
  previewImage.style.display = 'none';
  fileName.textContent = 'Nenhuma foto selecionada';
}

// Salvar profissional
function salvarProfissional(nome, especialidade, horaInicio, horaFim, email, telefone, senha, imagemBase64) {
  const id = 'pro_' + Date.now();
  const novoProfissional = {
    id: id,
    nome,
    especialidade,
    horaInicio,
    horaFim,
    email,
    telefone,
    senha,
    fotoPerfil: imagemBase64 || '',
    tipoConta: 'profissional'
  };

  const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
  profissionais.push(novoProfissional);
  localStorage.setItem('profissionais', JSON.stringify(profissionais));

  alert('Profissional salvo com sucesso!');
}

// Máscara de telefone
function mascararTelefone(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

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

window.mascararTelefone = mascararTelefone;