function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('usuarioCadastrado'); // ou clear()
  
    // Aqui já dá pra colocar chamada à API de logout quando tiver backend:
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(() => {
    //     // redireciona depois que o servidor confirmar logout
    //     window.location.href = '/login.html';
    //   });
  
    // Por enquanto, só redireciona direto
    window.location.href = '../aInicio/boasVindas.html';
  }

function listarProfissionais() {
  const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
  const container = document.getElementById('listarProfissionais');
  container.innerHTML = ''; // Limpa o conteúdo anterior

  if(profissionais.length === 0){
    container.innerHTML = '<p class="text-center m-4">Nenhum profissional cadastrado ainda.<p/>'
    return;
  }

  profissionais.forEach(profissional => {
    const card = document.createElement('div');
    card.className = 'card h-100';
    card.innerHTML = `
      <img id="cardimg" src="${profissional.fotoPerfil || '../../assets/default-avatar.png'}" class="card-img-top" alt="${profissional.nome}">
      <div class="card-body">
        <h5 class="card-title">${profissional.nome}</h5>
        <p class="card-text">Especialidade: ${profissional.especialidade}</p>
        <p class="card-text">Horário: ${profissional.horaInicio} - ${profissional.horaFim}</p>
         <a href="../GerenciarProfissionais/gp.html" type="button" class="btn btn-primary">Gerenciar</a>
      </div>`;
      container.appendChild(card);
  });
}
document.addEventListener("DOMContentLoaded", listarProfissionais);