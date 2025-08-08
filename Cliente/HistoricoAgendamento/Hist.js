// Remova a inicialização do Swiper daqui
// const swiper = new Swiper(".mySwiper", { ... });

document.addEventListener('DOMContentLoaded', function () {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const pendentesContainer = document.getElementById('pendentes-container');
  const concluidosContainer = document.getElementById('concluidos-container');
  
  // Limpa os containers antes de inserir os novos cards
  pendentesContainer.innerHTML = '';
  concluidosContainer.innerHTML = '';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera a hora para uma comparação precisa

  if (agendamentos.length === 0) {
    pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento pendente.</p>';
    concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
  } else {
    let temPendentes = false;
    let temConcluidos = false;

    agendamentos.forEach(agendamento => {
      const [dia, mes, ano] = agendamento.date.split('/').map(Number);
      const dataAgendamento = new Date(ano, mes - 1, dia); 
      dataAgendamento.setHours(0, 0, 0, 0);

      const isConcluido = dataAgendamento < hoje;
      
      if (isConcluido) {
        concluidosContainer.innerHTML += criarCardAgendamento(agendamento, true);
        temConcluidos = true;
      } else {
        pendentesContainer.innerHTML += criarCardAgendamento(agendamento, false);
        temPendentes = true;
      }
    });

    if (!temPendentes) {
      pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento pendente.</p>';
    }

    if (!temConcluidos) {
      concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
    }
  }

  // Mova a inicialização do Swiper para AQUI, após a injeção dos cards
  const swiper = new Swiper(".mySwiper", {
    simulateTouch: true,
    loop: false,
    slidesPerView: 1,
    grabCursor: true,
    on: {
      slideChange: () => {
        document.querySelectorAll(".tab-header button").forEach(btn => btn.classList.remove("active"));
        document.getElementById(`btn-tab-${swiper.activeIndex}`).classList.add("active");
        const titleElement = document.getElementById('tab-header-title');
        if (titleElement) {
          const currentSlide = swiper.slides[swiper.activeIndex];
          const newTitle = currentSlide.getAttribute('data-title');
          titleElement.textContent = newTitle || `Agendamentos`;
        }
      }
    }
  });

});

function criarCardAgendamento(agendamento, isConcluido) {
  const botoes = isConcluido 
    ? `<button class="reschedule" style="color: rgb(255, 255, 255)" data-bs-toggle="modal" data-bs-target="#ratingModal">Avaliar</button>`
    : `<button class="cancel" data-bs-toggle="modal" data-bs-target="#confirmCancelModal">Cancelar</button>
       <button class="reschedule" style="color: rgb(255, 255, 255)" data-bs-toggle="modal" data-bs-target="#confirmRescheduleModal">Reagendar</button>`;
  
  const cardClass = isConcluido ? 'post-card-feito' : 'post-card';

  return `
    <div class="${cardClass}">
      <img src="${agendamento.imagem}" alt="${agendamento.service}" class="model-image"/>
      <div class="details">
        <h3>${agendamento.service}</h3>
        <p>Duração: ${agendamento.duracao} min</p>
        <p>Data: ${agendamento.date}</p>
        <p>Hora: ${agendamento.time}</p>
        <p>Profissional: ${agendamento.professionalName}</p>
        <div class="actions">
          ${botoes}
        </div>
      </div>
    </div>
  `;
}