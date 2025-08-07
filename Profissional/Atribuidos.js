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
  } //vc é o milhor
  function listarAgendamentos() {
    const profissional =  JSON.parse(localStorage.getItem('profissionais') || '[]');
    const agendamento = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const container = document.getElementById('listarAgendamentos');
    container.innerHTML = '';
    const agendamentosDoProfissional = agendamento.filter(ag => ag.professionalId === profissional.id);

    if(agendamentosDoProfissional.length === 0){
      container.innerHTML = '<p class="text-center m-4">Nenhum agendamento disponível ainda.<p/>'
      return;
    }
  
    agendamento.forEach(agendamento => {
      const card = document.createElement('div');
      card.className = 'card h-100';
      card.innerHTML = `
        <img id="cardimg" src="${agendamento.imagem}" alt="${agendamento.service}" class="card-img-top">
        <div class="card-body">
          <h3 class="card-title">${agendamento.service}</h3>
          <p class="card-text">Duração: ${agendamento.duracao} min</p>
          <p class="card-text">Data: ${agendamento.date}</p>
          <p class="card-text">Horário: ${agendamento.time}</p>
          <p class="card-text">Cliente: ${agendamento.clienteNome}</p>
          <p class="card-text">Agendamento para ${profissional.nome}</p>
           <a href="#" type="button" class="btn btn-primary">Marcar como Concluído</a>
        </div>`;
        container.appendChild(card);
    });              
  }
  document.addEventListener("DOMContentLoaded", listarAgendamentos);