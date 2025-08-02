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