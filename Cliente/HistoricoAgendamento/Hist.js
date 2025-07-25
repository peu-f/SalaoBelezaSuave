document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContentContainer = document.querySelector('.tab-content-container');
    const tabIndicator = document.querySelector('.tab-indicator');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabHeaderTitle = document.getElementById('tab-header-title'); // Novo elemento

    let isSwiping = false;
    let startX;
    let currentTranslate = 0;
    let lastTranslate = 0;
    let activeTabIndex = 0; // 0 para 'pending', 1 para 'done'

    // Títulos correspondentes a cada aba
    const tabTitles = [
        "Agendamentos Pendentes", // Para activeTabIndex = 0
        "Agendamentos Concluídos" // Para activeTabIndex = 1 (ou "Agendamentos Feitos" como no botão)
    ];


    // Função para atualizar a aba ativa
    function setActiveTab(index) {
        // Remover 'active' de todos os botões e painéis
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Adicionar 'active' ao botão e painel corretos
        tabButtons[index].classList.add('active');
        tabPanes[index].classList.add('active');

        // Mover o conteúdo
        currentTranslate = -index * (tabContentContainer.offsetWidth / 2);
        tabContentContainer.style.transform = `translateX(${currentTranslate}px)`;

        // Mover o indicador
        tabIndicator.style.transform = `translateX(${index * 100}%)`;

        activeTabIndex = index;

        // Atualizar o título do header
        tabHeaderTitle.textContent = tabTitles[index];

        // *** ADIÇÃO IMPORTANTE: Chamar a função para configurar os botões dos cards ***
        setupAppointmentCardButtons();
    }

    // Event listeners para cliques nos botões
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            setActiveTab(index);
        });
    });

    // Lógica para o SWIPE (Touch Events)
    const tabContentWrapper = document.querySelector('.tab-content-wrapper'); // Usar o wrapper para os eventos de touch/mouse

    tabContentWrapper.addEventListener('touchstart', (e) => {
        isSwiping = true;
        startX = e.touches[0].clientX;
        tabContentContainer.style.transition = 'none'; // Desativar transição durante o swipe
        lastTranslate = -activeTabIndex * (tabContentContainer.offsetWidth / 2); // Garante que lastTranslate esteja correto no início do swipe
    });

    tabContentWrapper.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        tabContentContainer.style.transform = `translateX(${lastTranslate + deltaX}px)`;
        e.preventDefault(); // Previne o scroll vertical da página durante o swipe horizontal
    });

    tabContentWrapper.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        tabContentContainer.style.transition = 'transform 0.3s ease'; // Reativar transição

        // Calcular qual aba deve ser ativada
        const currentOffset = parseFloat(tabContentContainer.style.transform.replace('translateX(', '').replace('px)', ''));
        const tabWidth = tabContentContainer.offsetWidth / 2; // Largura de uma única aba de conteúdo
        
        let newActiveIndex = activeTabIndex;

        // Verifica se o swipe foi o suficiente para passar para a próxima/anterior aba
        // 1/3 da largura da aba como limite de transição
        if (currentOffset < lastTranslate - tabWidth / 3 && activeTabIndex < tabPanes.length - 1) {
            newActiveIndex++;
        } else if (currentOffset > lastTranslate + tabWidth / 3 && activeTabIndex > 0) {
            newActiveIndex--;
        }

        // Se não houver mudança, currentTranslate já é o valor correto para a aba atual
        // Se houver mudança, setActiveTab() vai recalcular currentTranslate
        lastTranslate = -newActiveIndex * tabWidth; // Atualiza a posição final do swipe
        setActiveTab(newActiveIndex); // Ativa a nova aba
    });

    // Lógica para swipe com o mouse (opcional, para desktop)
    let isMouseDown = false;
    let mouseStartX;

    tabContentWrapper.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
        tabContentContainer.style.transition = 'none';
        lastTranslate = -activeTabIndex * (tabContentContainer.offsetWidth / 2); // Garante que lastTranslate esteja correto
        e.preventDefault(); // Previne seleção de texto
    });

    tabContentWrapper.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const currentX = e.clientX;
        const deltaX = currentX - mouseStartX;
        tabContentContainer.style.transform = `translateX(${lastTranslate + deltaX}px)`;
    });

    tabContentWrapper.addEventListener('mouseup', () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        tabContentContainer.style.transition = 'transform 0.3s ease';

        const currentOffset = parseFloat(tabContentContainer.style.transform.replace('translateX(', '').replace('px)', ''));
        const tabWidth = tabContentContainer.offsetWidth / 2;
        
        let newActiveIndex = activeTabIndex;

        if (currentOffset < lastTranslate - tabWidth / 3 && activeTabIndex < tabPanes.length - 1) {
            newActiveIndex++;
        } else if (currentOffset > lastTranslate + tabWidth / 3 && activeTabIndex > 0) {
            newActiveIndex--;
        }

        lastTranslate = -newActiveIndex * tabWidth;
        setActiveTab(newActiveIndex);
    });

    tabContentWrapper.addEventListener('mouseleave', () => {
        if (isMouseDown) { // Se o mouse sair enquanto clicado
            isMouseDown = false;
            tabContentContainer.style.transition = 'transform 0.3s ease';
            setActiveTab(activeTabIndex); // Retorna para a aba original ou ativa a nova
        }
    });

    // Ajustar a posição inicial quando a página carrega e definir o título inicial
    setActiveTab(activeTabIndex);

    // *** ADIÇÃO IMPORTANTE: Nova função para configurar os botões dos cards ***
    function setupAppointmentCardButtons() {
        // Selecionar todos os botões de ação dentro dos cards
        const cancelButtons = document.querySelectorAll('.appointment-card .cancel');
        const rescheduleButtons = document.querySelectorAll('.appointment-card .reschedule');
        const evaluateButtons = document.querySelectorAll('.appointment-card .evaluate');

        // Adicionar o stopPropagation para o botão Cancelar
        cancelButtons.forEach(button => {
            button.removeEventListener('click', preventSwipePropagation); // Remove para evitar duplicidade
            button.addEventListener('click', preventSwipePropagation);
        });

        // Adicionar o stopPropagation para o botão Reagendar
        rescheduleButtons.forEach(button => {
            button.removeEventListener('click', preventSwipePropagation); // Remove para evitar duplicidade
            button.addEventListener('click', preventSwipePropagation);
        });

        // Adicionar o stopPropagation para o botão Avaliar
        evaluateButtons.forEach(button => {
            button.removeEventListener('click', preventSwipePropagation); // Remove para evitar duplicidade
            button.addEventListener('click', preventSwipePropagation);
        });
    }

    // *** ADIÇÃO IMPORTANTE: Função auxiliar para parar a propagação do evento ***
    function preventSwipePropagation(event) {
        event.stopPropagation(); // Impede que o evento de clique atinja o .tab-content-wrapper
    }

    // --- Lógica para os Modais de Confirmação (JÁ EXISTE, MANTENHA AQUI) ---

    // Botão "Sim, Cancelar" do modal de cancelamento
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
    if (cancelAppointmentBtn) {
        cancelAppointmentBtn.addEventListener('click', () => {
            alert('Agendamento cancelado com sucesso!');
            // ... (sua lógica para cancelar) ...
            const modalElement = document.getElementById('confirmCancelModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        });
    }

    // Botão "Sim, Continuar" do modal de reagendamento
    const rescheduleAppointmentBtn = document.getElementById('rescheduleAppointmentBtn');
    if (rescheduleAppointmentBtn) {
        rescheduleAppointmentBtn.addEventListener('click', () => {
            alert('Redirecionando para a tela de reagendamento...');
            // ... (sua lógica para reagendar) ...
            const modalElement = document.getElementById('confirmRescheduleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        });
    }

    // --- Lógica para o Modal de Avaliação (JÁ EXISTE, MANTENHA AQUI) ---

    const ratingStars = document.querySelectorAll('#ratingModal .star');
    const submitRatingBtn = document.getElementById('submitRatingBtn');
    const ratingComment = document.getElementById('ratingComment');
    let selectedRating = 0;

    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            // Remove a classe 'selected' de todas as estrelas
            ratingStars.forEach(s => s.classList.remove('selected'));
            // Adiciona a classe 'selected' até a estrela clicada
            for (let i = 0; i < selectedRating; i++) {
                ratingStars[i].classList.add('selected');
            }
        });

        // Lógica para hover (opcional, melhora UX em desktop)
        star.addEventListener('mouseover', () => {
            if (selectedRating === 0) { // Só mostra hover se nenhuma estrela foi selecionada
                const hoverValue = parseInt(star.dataset.value);
                ratingStars.forEach((s, index) => {
                    if (index < hoverValue) {
                        s.style.color = 'gold';
                    } else {
                        s.style.color = '#ccc';
                    }
                });
            }
        });

        star.addEventListener('mouseout', () => {
            if (selectedRating === 0) { // Reseta se nenhuma estrela foi selecionada
                ratingStars.forEach(s => s.style.color = '#ccc');
            }
        });
    });

    // Evento de clique no botão "Enviar Avaliação"
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', () => {
            if (selectedRating > 0) {
                const comment = ratingComment.value;
                alert(`Avaliação enviada: ${selectedRating} estrelas. Comentário: "${comment}"`);
                // Aqui você enviaria a avaliação para o seu backend ou a processaria
                // Ex: enviar via AJAX/fetch para uma API

                // Resetar o modal após o envio (opcional)
                selectedRating = 0;
                ratingStars.forEach(s => {
                    s.classList.remove('selected');
                    s.style.color = '#ccc'; // Garante que a cor seja resetada
                });
                ratingComment.value = '';

                // Fechar o modal
                const modalElement = document.getElementById('ratingModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            } else {
                alert('Por favor, selecione uma avaliação em estrelas.');
            }
        });
    }

    // Resetar estrelas e comentário ao abrir o modal (se quiser garantir que comece "limpo")
    const ratingModalElement = document.getElementById('ratingModal');
    if (ratingModalElement) {
        ratingModalElement.addEventListener('shown.bs.modal', function () {
            selectedRating = 0;
            ratingStars.forEach(s => {
                s.classList.remove('selected');
                s.style.color = '#ccc';
            });
            ratingComment.value = '';
        });
    }

    // *** ADIÇÃO IMPORTANTE: Chamar a função no carregamento inicial da página ***
    setupAppointmentCardButtons();

}); // Fim do DOMContentLoaded

// Exemplo de função logout (se você tiver uma lógica de logout)
function logout() {
    alert('Função de logout!');
    // Implemente sua lógica de logout aqui, como redirecionar para a página de login
    // window.location.href = 'pagina_de_login.html';
}