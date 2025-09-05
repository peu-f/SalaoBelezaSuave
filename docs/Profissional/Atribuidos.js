function logout() {
    localStorage.removeItem('profissionalLogado');
    alert('Você foi desconectado!');
    window.location.href = '../../index.html';
}

//mostrar user
document.addEventListener("DOMContentLoaded", () =>{
const profissionalLogado = JSON.parse(localStorage.getItem("profissionalLogado"));
const nomeUsuario = document.getElementById("username");

if (profissionalLogado && profissionalLogado.nome && nomeUsuario) {
  nomeUsuario.textContent = `${profissionalLogado.nome}`;
} else {
  // Se não tiver usuário logado, força logout ou redireciona
  
  
}
})

// Função para marcar agendamento como concluído - ATUALIZADA
function marcarComoConcluido(agendamentoId) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    // Encontra o agendamento pelo ID
    const agendamentoIndex = agendamentos.findIndex(ag => ag.id === agendamentoId);
    
    if (agendamentoIndex !== -1) {
        // IMPORTANTE: Marca como concluído com flag específica
        agendamentos[agendamentoIndex].concluido = true;
        agendamentos[agendamentoIndex].dataConclusao = new Date().toISOString();
        agendamentos[agendamentoIndex].concluidoPorProfissional = true; // Flag adicional
        
        // Salva de volta no localStorage
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        alert('Agendamento marcado como concluído!');
        console.log('Agendamento concluído:', agendamentos[agendamentoIndex]);
        
        // Atualiza a lista
        listarAgendamentos();
    } else {
        alert('Erro ao marcar agendamento como concluído.');
        console.error('Agendamento não encontrado:', agendamentoId);
    }
}

function listarAgendamentos() {
    const profissionalLogado = JSON.parse(localStorage.getItem("profissionalLogado") || "{}");
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const container = document.getElementById('listarAgendamentos');
    
    if (!container) {
        console.error('Container listarAgendamentos não encontrado');
        return;
    }
    
    // Limpa o container
    container.innerHTML = '';
    
    // Verifica se o profissional está logado
    if (!profissionalLogado.id) {
        container.innerHTML = '<p class="text-center text-danger m-4">Erro: Profissional não identificado. Faça login novamente.</p>';
        return;
    }
    
    // Filtra agendamentos do profissional logado
    const agendamentosDoProfissional = agendamentos.filter(agendamento => 
        agendamento.professionalId === profissionalLogado.id
    );
    
    if (agendamentosDoProfissional.length === 0) {
        container.innerHTML = '<p class="text-center m-4">Nenhum agendamento disponível ainda.</p>';
        return;
    }
    
    // Separa agendamentos pendentes e concluídos
    const agendamentosPendentes = agendamentosDoProfissional.filter(ag => !ag.concluido);
    const agendamentosConcluidos = agendamentosDoProfissional.filter(ag => ag.concluido);
    
    // Cria seções para pendentes e concluídos
    if (agendamentosPendentes.length > 0) {
        const titlePendentes = document.createElement('h4');
        titlePendentes.className = 'text-primary mt-4 mb-3';
        titlePendentes.textContent = `Agendamentos Pendentes (${agendamentosPendentes.length})`;
        container.appendChild(titlePendentes);
        
        const rowPendentes = document.createElement('div');
        rowPendentes.className = 'row';
        
        agendamentosPendentes.forEach(agendamento => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-3';
            
            const card = document.createElement('div');
            card.className = 'card h-100 shadow-sm';
            card.innerHTML = `
                <img src="${agendamento.imagem}" alt="${agendamento.service}" class="card-img-top" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${agendamento.service}</h5>
                    <p class="card-text"><strong>Duração:</strong> ${agendamento.duracao} min</p>
                    <p class="card-text"><strong>Data:</strong> ${agendamento.date}</p>
                    <p class="card-text"><strong>Horário:</strong> ${agendamento.time}</p>
                    <p class="card-text"><strong>Cliente:</strong> ${agendamento.clienteNome}</p>
                    <p class="card-text"><strong>Valor:</strong> ${agendamento.price}</p>
                    <div class="mt-auto">
                        <button 
                            onclick="confirmarConclusao('${agendamento.id}')" 
                            class="btn btn-success w-100"
                            title="Marcar como concluído">
                            <i class="bi bi-check-circle"></i> Marcar como Concluído
                        </button>
                    </div>
                </div>
            `;
            
            col.appendChild(card);
            rowPendentes.appendChild(col);
        });
        
        container.appendChild(rowPendentes);
    }
    
    // // Mostra agendamentos concluídos se existirem
    // if (agendamentosConcluidos.length > 0) {
    //     const titleConcluidos = document.createElement('h4');
    //     titleConcluidos.className = 'text-success mt-5 mb-3';
    //     titleConcluidos.textContent = `Agendamentos Concluídos (${agendamentosConcluidos.length})`;
    //     container.appendChild(titleConcluidos);
        
    //     const rowConcluidos = document.createElement('div');
    //     rowConcluidos.className = 'row';
        
    //     agendamentosConcluidos.forEach(agendamento => {
    //         const col = document.createElement('div');
    //         col.className = 'col-md-6 col-lg-4 mb-3';
            
    //         const dataConclusao = agendamento.dataConclusao 
    //             ? new Date(agendamento.dataConclusao).toLocaleDateString('pt-BR')
    //             : 'Data não informada';
            
    //         const card = document.createElement('div');
    //         card.className = 'card h-100 shadow-sm border-success';
    //         card.innerHTML = `
    //             <img src="${agendamento.imagem}" alt="${agendamento.service}" class="card-img-top" style="height: 200px; object-fit: cover; opacity: 0.8;">
    //             <div class="card-body d-flex flex-column">
    //                 <h5 class="card-title text-success">
    //                     ${agendamento.service} 
    //                     <i class="bi bi-check-circle-fill"></i>
    //                 </h5>
    //                 <p class="card-text"><strong>Duração:</strong> ${agendamento.duracao} min</p>
    //                 <p class="card-text"><strong>Data:</strong> ${agendamento.date}</p>
    //                 <p class="card-text"><strong>Horário:</strong> ${agendamento.time}</p>
    //                 <p class="card-text"><strong>Cliente:</strong> ${agendamento.clienteNome}</p>
    //                 <p class="card-text"><strong>Valor:</strong> ${agendamento.price}</p>
    //                 <p class="card-text"><small class="text-muted">Concluído em: ${dataConclusao}</small></p>
    //                 <div class="mt-auto">
    //                     <span class="badge bg-success w-100 py-2">
    //                         <i class="bi bi-check-circle-fill"></i> Serviço Concluído
    //                     </span>
    //                 </div>
    //             </div>
    //         `;
            
    //         col.appendChild(card);
    //         rowConcluidos.appendChild(col);
    //     });
        
    //     container.appendChild(rowConcluidos);
    // }
    // Se não há agendamentos pendentes nem concluídos
    if (
      agendamentosPendentes.length === 0 
      // && agendamentosConcluidos.length === 0
    ) {
        container.innerHTML = '<p class="text-center m-4">Nenhum agendamento disponível ainda.</p>';
    }
}

// Função para confirmar antes de marcar como concluído - NOVA
function confirmarConclusao(agendamentoId) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
    
    if (!agendamento) {
        alert('Agendamento não encontrado!');
        return;
    }
    
    const confirmMessage = `
Confirmar conclusão do serviço?

Cliente: ${agendamento.clienteNome}
Serviço: ${agendamento.service}
Data: ${agendamento.date}
Horário: ${agendamento.time}

Esta ação irá marcar o agendamento como concluído no histórico do cliente.
    `.trim();
    
    if (confirm(confirmMessage)) {
        marcarComoConcluido(agendamentoId);
    }
}

// Função para filtrar agendamentos por data
function filtrarPorData() {
    const dataFiltro = document.getElementById('filtroData')?.value;
    const statusFiltro = document.getElementById('filtroStatus')?.value;
    
    if (!dataFiltro && !statusFiltro) {
        listarAgendamentos();
        return;
    }
    
    const profissionalLogado = JSON.parse(localStorage.getItem("profissionalLogado") || "{}");
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const container = document.getElementById('listarAgendamentos');
    
    let agendamentosFiltrados = agendamentos.filter(agendamento => 
        agendamento.professionalId === profissionalLogado.id
    );
    
    if (dataFiltro) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.date === dataFiltro);
    }
    
    if (statusFiltro) {
        if (statusFiltro === 'pendentes') {
            agendamentosFiltrados = agendamentosFiltrados.filter(ag => !ag.concluido);
        } else if (statusFiltro === 'concluidos') {
            agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.concluido);
        }
    }
    
    // Renderizar filtrados (implementação similar ao listarAgendamentos)
    renderizarAgendamentosFiltrados(agendamentosFiltrados);
}

function renderizarAgendamentosFiltrados(agendamentos) {
    const container = document.getElementById('listarAgendamentos');
    container.innerHTML = '';
    
    if (agendamentos.length === 0) {
        container.innerHTML = '<p class="text-center m-4">Nenhum agendamento encontrado com os filtros aplicados.</p>';
        return;
    }
    
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página do profissional carregada');
    listarAgendamentos();
    
    // Adiciona event listeners para filtros se existirem
    const filtroData = document.getElementById('filtroData');
    const filtroStatus = document.getElementById('filtroStatus');
    
    if (filtroData) {
        filtroData.addEventListener('change', filtrarPorData);
    }
    
    if (filtroStatus) {
        filtroStatus.addEventListener('change', filtrarPorData);
    }
});

// Função para atualizar a lista automaticamente
function atualizarLista() {
    listarAgendamentos();
}

// Atualiza a lista a cada 30 segundos
setInterval(atualizarLista, 30000);