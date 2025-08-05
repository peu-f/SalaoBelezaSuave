const swiper = new Swiper(".mySwiper", {
      simulateTouch: true,
      grabCursor: true,
      on: {
        slideChange: () => {
          document.querySelectorAll(".tab-header button").forEach(btn => btn.classList.remove("active"));
          document.getElementById(`btn-tab-${swiper.activeIndex}`).classList.add("active");
          const  titleElement = document.getElementById('tab-header-title');
          if (titleElement) {
            const currentSlide = swiper.slides[swiper.activeIndex];
            const newTitle = currentSlide.getAttribute('data-title');
            titleElement.textContent = newTitle || `Agendamentos Feito`;
          }
        }
      }
    });

    document.addEventListener('DOMContentLoaded', function(){
      const agendamento = JSON.parse(localStorage.getItem('agendamento'), '[]')
      const container = document.querySelector('.post-card')
      container.innerHTML = '';

      if (agendamento.length === 0) {
          container.innerHTML = '<p class="text-center">Nenhum agendamento ainda.</p>';
          return;
      }
  
      // Para cada item na lista de 'servicos'
      servicos.forEach(agendamento => {
          let cardHTML = '';
  
          // Compara o tipo do serviço (usando '===')
          if (agendamento.tipo === 'servico') {
              cardHTML = criarCardAgendamento(agendamento);
          } else if (agendamento.tipo === 'oferta') {
              // oferta
          }
  
          // Adiciona o HTML do novo card ao container
          container.innerHTML += cardHTML;

        });
      });
