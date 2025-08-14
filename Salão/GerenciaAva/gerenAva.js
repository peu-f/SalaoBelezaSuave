function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('saloes'); // ou clear()
  
    // Aqui já dá pra colocar chamada à API de logout quando tiver backend:
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(() => {
    //     // redireciona depois que o servidor confirmar logout
    //     window.location.href = '/login.html';
    //   });
  
    // Por enquanto, só redireciona direto
    window.location.href = '../aInicio/boasVindas.html';
  }
  
  function calcularMediaAvaliacoes() {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    
    // Filtra apenas as avaliações publicadas
    const avaliacoesPublicadas = avaliacoes.filter(avaliacao => avaliacao.publicada === true);
    
    if (avaliacoesPublicadas.length === 0) {
        return {
            media: 0,
            total: 0,
            temAvaliacoes: false
        };
    }
    
    // Calcula a soma das notas
    const somaNotas = avaliacoesPublicadas.reduce((soma, avaliacao) => {
        return soma + (avaliacao.rating || 0);
    }, 0);
    
    // Calcula a média
    const media = somaNotas / avaliacoesPublicadas.length;
    
    return {
        media: media,
        total: avaliacoesPublicadas.length,
        temAvaliacoes: true
    };
  }
  
  function exibirMediaAvaliacoes() {
    const dadosMedia = calcularMediaAvaliacoes();
    
    // Encontra ou cria o elemento para mostrar a média
    let containerMedia = document.getElementById('media-avaliacoes');
    
    if (!containerMedia) {
        // Se não existir, cria o elemento
        containerMedia = document.createElement('div');
        containerMedia.id = 'media-avaliacoes';
        containerMedia.className = 'rating-container mt-3';
        
        // Insere depois do título do serviço (ou onde preferir)
        const serviceTitle = document.getElementById('service-detail-title');
        if (serviceTitle && serviceTitle.parentNode) {
            serviceTitle.parentNode.insertBefore(containerMedia, serviceTitle.nextSibling);
        }
    }
    
    if (dadosMedia.temAvaliacoes) {
        const mediaFormatada = dadosMedia.media.toFixed(1);
        
        containerMedia.innerHTML = `
            <div class="rating-display d-flex align-items-center justify-content-center mb-3">
                <div class="stars-container me-2">
                    ${criarEstrelasAvaliacao(Math.round(dadosMedia.media))}
                </div>
                <span class="rating-number fw-bold me-2">${mediaFormatada}</span>
                <span class="rating-count text-muted">(${dadosMedia.total} avaliação${dadosMedia.total > 1 ? 'ões' : ''})</span>
            </div>
        `;
    } else {
        containerMedia.innerHTML = `
            <div class="rating-display text-center mb-3">
                <span class="text-muted">Nenhuma avaliação publicada ainda</span>
            </div>
        `;
    }
  }
  
  function criarEstrelasAvaliacao(rating) {
    let estrelasHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            // Estrela preenchida (dourada)
            estrelasHTML += `<i class="bi bi-star-fill star" data-value="${i}" style="color: #ffc107;"></i>`;
        } else {
            // Estrela vazia (cinza)
            estrelasHTML += `<i class="bi bi-star star" data-value="${i}" style="color: #dee2e6;"></i>`;
        }
    }
    return estrelasHTML;
  }
  
  function listarAvaliacoes() {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    const container = document.getElementById('listarAvaliacoes');
    
    console.log('Container encontrado:', !!container); // Debug
    console.log('Número de avaliações:', avaliacoes.length); // Debug
    
    if (!container) {
        console.error('Container com ID "listarAvaliacoes" não encontrado!');
        return;
    }
    
    container.innerHTML = ''; // Limpa o conteúdo anterior
  
    if (avaliacoes.length === 0) {
        container.innerHTML = '<p class="text-center m-4">Nenhuma avaliação encontrada ainda.</p>';
        return;
    }
  
    avaliacoes.forEach((avaliacao, index) => {
        console.log(`Criando card para avaliação ${index}:`, avaliacao); // Debug
        
        const card = document.createElement('div');
        card.className = 'card h-100 text-center';
        
        // Verifica se a avaliação já foi publicada
        const jaPublicada = avaliacao.publicada === true;
        
        // Cria um ID único para cada botão
        const botaoPublicarId = `botao-publicar-${index}`;
        
        // Define o conteúdo dos botões baseado no status
        let botaoPublicarHTML;
        if (jaPublicada) {
            botaoPublicarHTML = `
                <button type="button" 
                        id="${botaoPublicarId}" 
                        class="btn" 
                        style="pointer-events: none; background-color: gray; color: #2c3e50;" 
                        disabled>
                    ✓ Já Publicada
                </button>
            `;
        } else {
            botaoPublicarHTML = `
                <button type="button" 
                        id="${botaoPublicarId}" 
                        class="btn" 
                        onclick="publicarAvaliacao(${index})">
                    Publicar avaliação
                </button>
            `;
        }
        
        card.innerHTML = `
            <h5 class="card-title">${avaliacao.clienteNome || 'Cliente'} - ID: ${avaliacao.clienteId || 'N/A'}</h5>
            <p class="card-text">Serviço: ${avaliacao.serviceName || 'Serviço não informado'}</p>
            <p class="card-text">"${avaliacao.comment || 'Sem comentário'}"</p>
            <p class="card-text">${avaliacao.dataFormatada || 'Data não informada'}</p>
            <div class="rating m-4">
                ${criarEstrelasAvaliacao(avaliacao.rating || 0)}
            </div>
            <div class="buttons">
                ${botaoPublicarHTML}
                <button class="btn" onclick="excluirAvaliacao(${index})">Excluir avaliação</button>
            </div>
        `;
        container.appendChild(card);
        console.log(`Card ${index} adicionado ao container`); // Debug
    });
  }
  
  function publicarAvaliacao(index) {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    
    if (index < avaliacoes.length) {
        // Verifica se já foi publicada
        if (avaliacoes[index].publicada === true) {
            alert('Esta avaliação já foi publicada!');
            return; // Sai da função se já foi publicada
        }
        
        // Marcar como publicada
        avaliacoes[index].publicada = true;
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        
        alert('Avaliação publicada com sucesso!');
        listarAvaliacoes(); // Recarrega a lista para mostrar o botão cinza
        
        // Atualiza a média se estivermos na página do serviço
        if (typeof exibirMediaAvaliacoes === 'function') {
            exibirMediaAvaliacoes();
        }
    }
  }
  
  function excluirAvaliacao(index) {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
        const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
        
        if (index < avaliacoes.length) {
            // Remove a avaliação do array
            avaliacoes.splice(index, 1);
            localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
            
            alert('Avaliação excluída com sucesso!');
            listarAvaliacoes(); // Recarrega a lista
        }
    }
  }
  
  // Função para debug - verificar avaliações
  function debugAvaliacoes() {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    console.log('=== DEBUG AVALIAÇÕES ===');
    console.log('Total de avaliações:', avaliacoes.length);
    console.log('Dados do localStorage:', localStorage.getItem('avaliacoes'));
    avaliacoes.forEach((av, i) => {
        console.log(`Avaliação ${i + 1}:`, {
            clienteId: av.clienteId,
            clienteNome: av.clienteNome,
            serviceName: av.serviceName,
            rating: av.rating,
            comment: av.comment,
            data: av.dataFormatada,
            publicada: av.publicada || false
        });
    });
    console.log('=== FIM DEBUG AVALIAÇÕES ===');
  }
  
  // Função para criar avaliações de teste (temporária)
  function criarAvaliacoesTestePara() {
    const avaliacoesExemplo = [
        {
            clienteId: '12345',
            clienteNome: 'Maria Silva',
            serviceName: 'Escova Modeladora',
            rating: 5,
            comment: 'Excelente serviço! Ficou perfeito.',
            dataFormatada: '14/08/2025',
            publicada: false
        },
        {
            clienteId: '67890',
            clienteNome: 'Ana Costa',
            serviceName: 'Corte Feminino',
            rating: 4,
            comment: 'Muito bom, recomendo!',
            dataFormatada: '13/08/2025',
            publicada: true
        }
    ];
    
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesExemplo));
    console.log('Avaliações de teste criadas!');
    listarAvaliacoes();
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    console.log('Carregando página de gerenciamento de avaliações...');
    
    // Verificar se o container existe
    const container = document.getElementById('listarAvaliacoes');
    if (!container) {
        console.error('ERRO: Elemento com ID "listarAvaliacoes" não encontrado no HTML!');
        console.log('Certifique-se de que existe um elemento com id="listarAvaliacoes" no seu HTML');
        return;
    }
    
    debugAvaliacoes();
    listarAvaliacoes();
    
    // TEMPORÁRIO: Descomente a linha abaixo se quiser criar avaliações de teste
    // criarAvaliacoesTestePara();
  });