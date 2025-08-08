function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('usuarioCadastrado'); // ou clear()
    window.location.href = '../../Cliente/aInicio/boasVindas.html';
  } //vc é o milhor
  function listarAgendamentos() {
    const profissionalLogado = JSON.parse(localStorage.getItem("profissionalLogado") || "{}");
    const agendamento = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const container = document.getElementById('listarAgendamentos');
    container.innerHTML = '';
  
    const agendamentosDoProfissional = agendamento.filter(agendamento => agendamento.professionalId === profissionalLogado.id);
  
    if(agendamentosDoProfissional.length === 0){
      container.innerHTML = '<p class="text-center m-4">Nenhum agendamento disponível ainda.<p/>';
      return;
    }
  
    agendamentosDoProfissional.forEach(agendamento => {
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
          <p class="card-text">Agendamento para ${profissionalLogado.nome}</p>
          <a href="#" type="button" class="btn btn-primary">Marcar como Concluído</a>
        </div>`;
      container.appendChild(card);
    });
  }
  