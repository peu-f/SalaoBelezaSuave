let agendamentoParaCancelar = null;
let agendamentoParaAvaliar = null; // Variável global para avaliação
let swiperInstance = null;

function criarCardAgendamento(agendamento = {}, isConcluido = false, index = 0) {
  const imagem = agendamento.imagem || '../../assets/maquiagem.jpg';
  const prof = agendamento.professionalName || '';
  const duracao = agendamento.duracao ?? '';
  const service = agendamento.service || '';
  const date = agendamento.date || '';
  const time = agendamento.time || '';

  const botoes = isConcluido
    ? `<button class="reschedule" style="color:#fff" data-bs-toggle="modal" data-bs-target="#ratingModal">Avaliar</button>`
    : `<button class="cancel" data-index="${index}" data-bs-toggle="modal" data-bs-target="#confirmCancelModal">Cancelar</button>
       <button class="reschedule" style="color:#fff" data-bs-toggle="modal" data-bs-target="#confirmRescheduleModal">Reagendar</button>`;

  const cardClass = isConcluido ? 'post-card' : 'post-card';

  return `
    <div class="${cardClass}" data-index="${index}">
      <img src="${imagem}" alt="${service}" class="model-image"/>
      <div class="details">
        <h3>${service}</h3>
        <p>Duração: ${duracao} min</p>
        <p>Data: ${date}</p>
        <p>Hora: ${time}</p>
        <p>Profissional: ${prof}</p>
        <div class="actions">
          ${botoes}
        </div>
      </div>
    </div>
  `;
}

function verificarStatusAgendamento(agendamento) {
  // Primeiro verifica se foi marcado como concluído pelo profissional
  if (agendamento.concluido === true) {
    return true;
  }
  
  // Se não foi marcado como concluído, verifica se a data já passou
  if (agendamento.date) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const parts = agendamento.date.split('/').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const dataAgendamento = new Date(parts[2], parts[1] - 1, parts[0]);
      dataAgendamento.setHours(0, 0, 0, 0);
      return dataAgendamento < hoje;
    }
  }
  
  return false;
}

function initializeSwiper() {
  // Destrói a instância anterior se existir
  if (swiperInstance) {
    try {
      swiperInstance.destroy(true, true);
    } catch (err) {
      console.warn('Erro ao destruir swiper anterior:', err);
    }
    swiperInstance = null;
  }

  // Aguarda um pouco para garantir que o DOM foi atualizado
  setTimeout(() => {
    try {
      swiperInstance = new Swiper(".mySwiper", {
        // Configurações essenciais para funcionar
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        allowTouchMove: true,
        grabCursor: true,
        
        // Configurações de slide
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: false,
        
        // Configurações de resistência
        resistance: true,
        resistanceRatio: 0.85,
        
        // Configurações de velocidade
        speed: 300,
        
        // Desabilita loop para evitar problemas
        loop: false,
        
        // Configurações de direção
        direction: 'horizontal',
        
        // Callbacks
        on: {
          init: function() {
            console.log('Swiper inicializado com sucesso');
            updateTabState(0);
          },
          
          slideChange: function() {
            console.log('Slide mudou para:', this.activeIndex);
            updateTabState(this.activeIndex);
          },
          
          touchStart: function() {
            console.log('Touch iniciado');
          },
          
          touchEnd: function() {
            console.log('Touch finalizado');
          }
        }
      });

      // Configura event listeners para os botões de tab
      setupTabButtons();
      
      console.log('Swiper configurado:', swiperInstance);
      
    } catch (error) {
      console.error('Erro ao inicializar Swiper:', error);
    }
  }, 100);
}

function updateTabState(activeIndex) {
  // Atualiza os botões das tabs
  document.querySelectorAll(".tab-header button").forEach(btn => {
    btn.classList.remove("active");
  });
  
  const activeBtn = document.getElementById(`btn-tab-${activeIndex}`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  // Atualiza o título
  const titleElement = document.getElementById('tab-header-title');
  const slides = document.querySelectorAll('.swiper-slide');
  
  if (titleElement && slides[activeIndex]) {
    const newTitle = slides[activeIndex].getAttribute('data-title') || '';
    titleElement.textContent = newTitle;
  }
}

function setupTabButtons() {
  const btn0 = document.getElementById('btn-tab-0');
  const btn1 = document.getElementById('btn-tab-1');
  
  if (btn0) {
    btn0.onclick = (e) => {
      e.preventDefault();
      console.log('Clique no botão tab 0');
      if (swiperInstance) {
        swiperInstance.slideTo(0);
      }
    };
  }
  
  if (btn1) {
    btn1.onclick = (e) => {
      e.preventDefault();
      console.log('Clique no botão tab 1');
      if (swiperInstance) {
        swiperInstance.slideTo(1);
      }
    };
  }
}

function renderAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  const pendentesContainer = document.getElementById('pendentes-container');
  const concluidosContainer = document.getElementById('concluidos-container');

  if (!pendentesContainer || !concluidosContainer) {
    console.error('Containers de agendamento não encontrados no DOM');
    return;
  }

  pendentesContainer.innerHTML = '';
  concluidosContainer.innerHTML = '';

  console.log('Total de agendamentos:', agendamentos.length);
  console.log('Usuário logado:', usuarioLogado);

  if (agendamentos.length === 0) {
    pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento pendente.</p>';
    concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
    initializeSwiper();
    return;
  }

  // Filtra apenas os agendamentos do cliente logado
  const agendamentosDoCliente = agendamentos.filter(agendamento => {
    if (agendamento.clienteId && usuarioLogado.id && agendamento.clienteId === usuarioLogado.id) {
      return true;
    }
    if (agendamento.clienteNome && usuarioLogado.nome && agendamento.clienteNome === usuarioLogado.nome) {
      return true;
    }
    return false;
  });

  console.log('Agendamentos filtrados do cliente:', agendamentosDoCliente);

  if (agendamentosDoCliente.length === 0) {
    pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento encontrado para este cliente.</p>';
    concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
    initializeSwiper();
    return;
  }

  let temPendentes = false;
  let temConcluidos = false;

  agendamentosDoCliente.forEach((agendamento, index) => {
    const isConcluido = verificarStatusAgendamento(agendamento);
    const cardHTML = criarCardAgendamento(agendamento, isConcluido, index);
    
    if (isConcluido) {
      concluidosContainer.insertAdjacentHTML('beforeend', cardHTML);
      temConcluidos = true;
    } else {
      pendentesContainer.insertAdjacentHTML('beforeend', cardHTML);
      temPendentes = true;
    }
  });

  if (!temPendentes) {
    pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento pendente.</p>';
  }
  if (!temConcluidos) {
    concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
  }

  // Inicializa o Swiper após renderizar o conteúdo
  initializeSwiper();
}

// Função para atualizar a visualização periodicamente
function atualizarVisualizacao() {
  renderAgendamentos();
}

// Função de debug
function debugAgendamentos() {
  console.log('=== DEBUG AGENDAMENTOS ===');
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  
  console.log('Usuário logado completo:', usuarioLogado);
  console.log('Total agendamentos:', agendamentos.length);
  
  agendamentos.forEach((ag, i) => {
    console.log(`Agendamento ${i}:`, {
      id: ag.id,
      service: ag.service,
      clienteId: ag.clienteId,
      clienteNome: ag.clienteNome,
      concluido: ag.concluido
    });
  });
  
  console.log('=== FIM DEBUG ===');
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM carregado, inicializando aplicação...');
  
  debugAgendamentos();
  renderAgendamentos();

  // Event listener para cancelamento e avaliação
  document.addEventListener('click', function (e) {
    // Para cancelamento
    if (e.target && e.target.classList.contains('cancel')) {
      const card = e.target.closest('[data-index]');
      if (card) {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const agendamentosDoCliente = agendamentos.filter(ag => 
          ag.clienteId === usuarioLogado.id || ag.clienteNome === usuarioLogado.nome
        );
        
        const indexLocal = Number(card.dataset.index);
        if (indexLocal < agendamentosDoCliente.length) {
          const agendamentoParaCancelarObj = agendamentosDoCliente[indexLocal];
          agendamentoParaCancelar = agendamentos.findIndex(ag => 
            ag.id === agendamentoParaCancelarObj.id
          );
        }
      }
    }
    
    // Para avaliação - captura qual agendamento está sendo avaliado
    if (e.target && e.target.textContent.trim() === 'Avaliar') {
      const card = e.target.closest('[data-index]');
      if (card) {
        agendamentoParaAvaliar = card.dataset.index;
        console.log('Agendamento selecionado para avaliação:', agendamentoParaAvaliar);
      }
    }
  });

  // Confirmação do cancelamento
  const cancelConfirmBtn = document.getElementById('cancelAppointmentBtn');
  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', function () {
      if (agendamentoParaCancelar === null || agendamentoParaCancelar < 0) return;

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      if (agendamentoParaCancelar < agendamentos.length) {
        agendamentos.splice(agendamentoParaCancelar, 1);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmCancelModal'));
        if (modal) modal.hide();
        
        alert('Agendamento cancelado com sucesso!');
        renderAgendamentos();
      }
      agendamentoParaCancelar = null;
    });
  }

  // Sistema de avaliação por estrelas
  const stars = document.querySelectorAll('.star');
  let selectedRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', function() {
      highlightStars(index + 1);
    });

    star.addEventListener('click', function() {
      selectedRating = index + 1;
      highlightStars(selectedRating);
    });
  });

  // Event listener para envio de avaliação
  const submitRatingBtn = document.getElementById('submitRatingBtn');
  if (submitRatingBtn) {
    submitRatingBtn.addEventListener('click', function() {
      if (selectedRating > 0) {
        const comment = document.getElementById('ratingComment').value;
        
        // Criar objeto da avaliação
        const novaAvaliacao = {
          agendamentoIndex: agendamentoParaAvaliar,
          rating: selectedRating,
          comment: comment,
          data: new Date().toISOString(),
          dataFormatada: new Date().toLocaleDateString('pt-BR'),
          id: Date.now() // ID único baseado no timestamp
        };
        
        // Recuperar avaliações existentes ou criar array vazio
        const avaliacoesExistentes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
        
        // Adicionar nova avaliação ao array
        avaliacoesExistentes.push(novaAvaliacao);
        
        // Salvar no localStorage
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesExistentes));
        
        // Também salvar a avaliação no próprio agendamento
        salvarAvaliacaoNoAgendamento(novaAvaliacao);
        
        console.log('Avaliação enviada:', novaAvaliacao);
        console.log('Todas as avaliações:', avaliacoesExistentes);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('ratingModal'));
        if (modal) modal.hide();
        
        resetRating();
        alert('Avaliação enviada com sucesso!');
        
        // Limpar referência
        agendamentoParaAvaliar = null;
        
      } else {
        alert('Por favor, selecione uma avaliação.');
      }
    });
  }

  function highlightStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('bi-star');
        star.classList.add('bi-star-fill');
        star.style.color = '#ffc107';
      } else {
        star.classList.remove('bi-star-fill');
        star.classList.add('bi-star');
        star.style.color = '#dee2e6';
      }
    });
  }

  function resetRating() {
    selectedRating = 0;
    const commentField = document.getElementById('ratingComment');
    if (commentField) commentField.value = '';
    highlightStars(0);
  }

  // Atualiza a visualização periodicamente
  setInterval(atualizarVisualizacao, 10000);
});

// Função para salvar avaliação diretamente no agendamento
function salvarAvaliacaoNoAgendamento(avaliacao) {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  
  // Filtrar agendamentos do cliente
  const agendamentosDoCliente = agendamentos.filter(ag => 
    ag.clienteId === usuarioLogado.id || ag.clienteNome === usuarioLogado.nome
  );
  
  // Encontrar o agendamento correto
  const indexLocal = parseInt(avaliacao.agendamentoIndex);
  if (indexLocal < agendamentosDoCliente.length) {
    const agendamentoParaAvaliarObj = agendamentosDoCliente[indexLocal];
    
    // Encontrar índice no array completo
    const indexGlobal = agendamentos.findIndex(ag => ag.id === agendamentoParaAvaliarObj.id);
    
    if (indexGlobal !== -1) {
      // Adicionar avaliação ao agendamento
      agendamentos[indexGlobal].avaliacao = {
        rating: avaliacao.rating,
        comment: avaliacao.comment,
        data: avaliacao.data,
        avaliado: true
      };
      
      // Salvar agendamentos atualizados
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
      console.log('Avaliação salva no agendamento:', agendamentos[indexGlobal]);
    }
  }
}

// Função para recuperar todas as avaliações
function obterAvaliacoes() {
  return JSON.parse(localStorage.getItem('avaliacoes') || '[]');
}

// Função para debug das avaliações
function debugAvaliacoes() {
  console.log('=== DEBUG AVALIAÇÕES ===');
  const avaliacoes = obterAvaliacoes();
  console.log('Total de avaliações:', avaliacoes.length);
  avaliacoes.forEach((av, i) => {
    console.log(`Avaliação ${i + 1}:`, {
      rating: av.rating,
      comment: av.comment,
      data: av.dataFormatada,
      agendamento: av.agendamentoIndex
    });
  });
  console.log('=== FIM DEBUG AVALIAÇÕES ===');
}

// Função de logout
function logout() {
  localStorage.removeItem('usuarioLogado');
  alert('Você foi desconectado!');
  window.location.href = '../aInicio/boasVindas.html';
}