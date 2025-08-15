let agendamentoParaCancelar = null;
let agendamentoParaAvaliar = null;
let agendamentoParaReagendar = null; // Variável global para reagendamento
let swiperInstance = null;
let selectedRating = 0;

function criarCardAgendamento(agendamento = {}, isConcluido = false, index = 0) {
    const imagem = agendamento.imagem || '../../assets/maquiagem.jpg';
    const prof = agendamento.professionalName || '';
    const duracao = agendamento.duracao ?? '';
    const service = agendamento.service || '';
    const date = agendamento.date || '';
    const time = agendamento.time || '';

    const jaAvaliado = agendamento.avaliacao && agendamento.avaliacao.avaliado;

    const botoes = isConcluido
    ? jaAvaliado
    ? `<button class="reschedule" disabled style="background-color:var(--border-color); opacity:0.6; cursor:not-allowed">Avaliado</button>`
    : `<button class="reschedule" style="color:#fff" data-index="${index}" data-bs-toggle="modal" data-bs-target="#ratingModal">Avaliar</button>`
    : `<button class="cancel" data-index="${index}" data-bs-toggle="modal" data-bs-target="#confirmCancelModal">Cancelar</button>
       <button class="reschedule" style="color:#fff" data-index="${index}" data-bs-toggle="modal" data-bs-target="#confirmRescheduleModal">Reagendar</button>`;

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
    if (agendamento.concluido === true) {
        return true;
    }
    
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
    if (swiperInstance) {
        try {
            swiperInstance.destroy(true, true);
        } catch (err) {
            console.warn('Erro ao destruir swiper anterior:', err);
        }
        swiperInstance = null;
    }

    setTimeout(() => {
        try {
            swiperInstance = new Swiper(".mySwiper", {
                touchRatio: 1,
                touchAngle: 45,
                simulateTouch: true,
                allowTouchMove: true,
                grabCursor: true,
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
                resistance: true,
                resistanceRatio: 0.85,
                speed: 300,
                loop: false,
                direction: 'horizontal',
                on: {
                    init: function() {
                        updateTabState(0);
                    },
                    slideChange: function() {
                        updateTabState(this.activeIndex);
                    },
                    touchStart: function() {},
                    touchEnd: function() {}
                }
            });
            setupTabButtons();
        } catch (error) {
            console.error('Erro ao inicializar Swiper:', error);
        }
    }, 100);
}

function updateTabState(activeIndex) {
    document.querySelectorAll(".tab-header button").forEach(btn => {
        btn.classList.remove("active");
    });
    
    const activeBtn = document.getElementById(`btn-tab-${activeIndex}`);
    if (activeBtn) {
        activeBtn.classList.add("active");
    }

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
            if (swiperInstance) {
                swiperInstance.slideTo(0);
            }
        };
    }
    
    if (btn1) {
        btn1.onclick = (e) => {
            e.preventDefault();
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

    if (agendamentos.length === 0) {
        pendentesContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento pendente.</p>';
        concluidosContainer.innerHTML = '<p class="text-center mt-4">Nenhum agendamento concluído.</p>';
        initializeSwiper();
        return;
    }

    const agendamentosDoCliente = agendamentos.filter(agendamento => {
        return (agendamento.clienteId && usuarioLogado.id && agendamento.clienteId === usuarioLogado.id) ||
               (agendamento.clienteNome && usuarioLogado.nome && agendamento.clienteNome === usuarioLogado.nome);
    });

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

    initializeSwiper();
}

function atualizarVisualizacao() {
    renderAgendamentos();
}

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

function salvarAvaliacaoNoAgendamento(avaliacao) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    
    const agendamentosDoCliente = agendamentos.filter(ag => 
        ag.clienteId === usuarioLogado.id || ag.clienteNome === usuarioLogado.nome
    );
    
    const indexLocal = parseInt(avaliacao.agendamentoIndex);
    
    if (indexLocal < agendamentosDoCliente.length) {
        const agendamentoParaAvaliarObj = agendamentosDoCliente[indexLocal];
        
        const indexGlobal = agendamentos.findIndex(ag => ag.id === agendamentoParaAvaliarObj.id);
        
        if (indexGlobal !== -1) {
            agendamentos[indexGlobal].avaliacao = {
                serviceName: agendamentos[indexGlobal].service,
                clienteId: usuarioLogado.id,
                clienteNome: usuarioLogado.nome,
                rating: avaliacao.rating,
                comment: avaliacao.comment,
                data: avaliacao.data,
                dataFormatada: avaliacao.dataFormatada,
                avaliado: true
            };
            
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
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

function logout() {
    localStorage.removeItem('usuarioLogado');
    alert('Você foi desconectado!');
    window.location.href = '../aInicio/boasVindas.html';
}

/**
 * Redireciona para a página de agendamento com os dados do serviço
 * do agendamento a ser reagendado.
 */
function redirecionarParaReagendamento() {
    if (agendamentoParaReagendar === null) {
        alert('Erro: Agendamento não selecionado para reagendamento.');
        return;
    }

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    // Filtra agendamentos do cliente e usa o índice local para encontrar o agendamento correto.
    const agendamentosDoCliente = agendamentos.filter(ag => 
        ag.clienteId === usuarioLogado.id || ag.clienteNome === usuarioLogado.nome
    );
    
    const agendamento = agendamentosDoCliente[agendamentoParaReagendar];

    if (!agendamento) {
        alert('Erro: Agendamento não encontrado.');
        return;
    }
    
    // Cria um objeto com os dados do serviço para ser usado na página de agendamento.
    const serviceData = {
        titulo: agendamento.service,
        duracao: agendamento.duracao,
        preco: agendamento.price ? agendamento.price.replace('R$ ', '').replace(',', '.') : '',
        imagem: agendamento.imagem,
    };

    // Salva os dados no localStorage para que a página de agendamento possa acessá-los.
    localStorage.setItem('produtoSelecionado', JSON.stringify(serviceData));
    
    // Redireciona para a página de agendamento.
    window.location.href = `../bAgendamento/Agend.html?reagendandoId=${agendamento.id}`;
}

document.addEventListener('DOMContentLoaded', function () {
    debugAgendamentos();
    renderAgendamentos();

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
        
        // Para reagendamento
        if (e.target && e.target.textContent.trim() === 'Reagendar') {
            const card = e.target.closest('[data-index]');
            if (card) {
                agendamentoParaReagendar = parseInt(card.dataset.index);
                // O modal será aberto automaticamente pelo data-bs-toggle.
            }
        }

        // Para avaliação
        if (e.target && e.target.textContent.trim() === 'Avaliar') {
            const card = e.target.closest('[data-index]');
            if (card) {
                agendamentoParaAvaliar = parseInt(card.dataset.index);
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
    
    // Confirmação do reagendamento
    const rescheduleConfirmBtn = document.getElementById('rescheduleAppointmentBtn');
    if (rescheduleConfirmBtn) {
        rescheduleConfirmBtn.addEventListener('click', function() {
            redirecionarParaReagendamento();
        });
    }

    // Sistema de avaliação por estrelas
    const stars = document.querySelectorAll('.star');

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
            if (selectedRating > 0 && agendamentoParaAvaliar !== null) {
                const comment = document.getElementById('ratingComment').value;
                const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
                
                const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
                const agendamentosDoCliente = agendamentos.filter(ag => 
                    ag.clienteId === usuarioLogado.id || ag.clienteNome === usuarioLogado.nome
                );
                
                let serviceName = '';
                if (agendamentoParaAvaliar < agendamentosDoCliente.length) {
                    serviceName = agendamentosDoCliente[agendamentoParaAvaliar].service || '';
                }
                
                const novaAvaliacao = {
                    agendamentoIndex: agendamentoParaAvaliar,
                    clienteId: usuarioLogado.id,
                    clienteNome: usuarioLogado.nome,
                    serviceName: serviceName,
                    rating: selectedRating,
                    comment: comment,
                    data: new Date().toISOString(),
                    dataFormatada: new Date().toLocaleDateString('pt-BR'),
                    id: Date.now()
                };
                
                const avaliacoesExistentes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
                avaliacoesExistentes.push(novaAvaliacao);
                localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesExistentes));
                
                salvarAvaliacaoNoAgendamento(novaAvaliacao);
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('ratingModal'));
                if (modal) modal.hide();
                resetRating();
                alert('Avaliação enviada com sucesso!');
                agendamentoParaAvaliar = null;
                
            } else {
                if (selectedRating === 0) {
                    alert('Por favor, selecione uma avaliação (estrelas).');
                }
                if (agendamentoParaAvaliar === null) {
                    alert('Erro: Agendamento não identificado. Tente fechar e abrir a avaliação novamente.');
                }
            }
        });
    }
});