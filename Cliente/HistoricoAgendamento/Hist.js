const swiper = new Swiper(".mySwiper", {
      simulateTouch: true,
      loop: false,
      slidesPerView: 1,
      grabCursor: true,
      on: {
        slideChange: () => {
          document.querySelectorAll(".tab-header button").forEach(btn => btn.classList.remove("active"));
          document.getElementById(`btn-tab-${swiper.activeIndex}`).classList.add("active");
          const  titleElement = document.getElementById('tab-header-title');
          if (titleElement) {
            const currentSlide = swiper.slides[swiper.activeIndex];
            const newTitle = currentSlide.getAttribute('data-title');
            titleElement.textContent = newTitle || `Agendamentos Concluídos`;
          }
        }
      }
    });

    document.addEventListener('DOMContentLoaded', function () {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const slides = document.querySelectorAll('.swiper-slide');
    
      // Limpa todos os slides antes de inserir os dados
      slides.forEach(slide => {
        slide.innerHTML = ''; // ou você pode manter um wrapper e fazer .querySelector('.post-card-container').innerHTML = '';
      });
    
      if (agendamentos.length === 0) {
        slides.forEach(slide => {
          slide.innerHTML = '<p class="text-center">Nenhum agendamento ainda.</p>';
        });
        return;
      }
    
      // Distribui os agendamentos nos slides (exemplo: um slide por agendamento)
      agendamentos.forEach((item, index) => {
        const slideIndex = index % slides.length; // Distribuição circular caso tenha mais agendamentos que slides
        slides[slideIndex].innerHTML += criarCardAgendamento(item);
      });
    });
    
    function criarCardAgendamento(agendamento) {
      return `
        <div class="post-card">
          <img src="${agendamento.imagem}" alt="${agendamento.service}" class="model-image"/>
          <div class="details">
            <h3>${agendamento.service}</h3>
            <p>Duração: ${agendamento.duracao} min</p>
            <p>Data: ${agendamento.date}</p>
            <p>Hora: ${agendamento.time}</p>
            <p>Profissional: ${agendamento.professionalName}</p>
            <div class="actions">
              <button class="cancel" data-bs-toggle="modal" data-bs-target="#confirmCancelModal">Cancelar</button>
              <button class="reschedule" style="color: rgb(255, 255, 255)" data-bs-toggle="modal" data-bs-target="#confirmRescheduleModal">Reagendar</button>
            </div>
          </div>
        </div>
      `;
    }
    