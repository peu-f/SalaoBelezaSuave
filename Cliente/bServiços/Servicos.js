// Função para calcular a média das avaliações publicadas
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

// Função para criar estrelas compatíveis com o HTML da página
function criarEstrelasParaPagina(rating) {
    let estrelasHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            // Estrela preenchida (dourada)
            estrelasHTML += `<span class="star filled">&#9733;</span>`;
        } else {
            // Estrela vazia (cinza)
            estrelasHTML += `<span class="star">&#9733;</span>`;
        }
    }
    return estrelasHTML;
}

// Função para exibir a média na página do serviço
function exibirMediaAvaliacoes() {
    const dadosMedia = calcularMediaAvaliacoes();
    
    // Encontra a seção de reviews existente
    const reviewCard = document.querySelector('.review-card');
    const starsContainer = document.querySelector('.stars');
    
    if (!reviewCard || !starsContainer) {
        console.warn('Seção de reviews não encontrada no HTML');
        return;
    }
    
    if (dadosMedia.temAvaliacoes) {
        const mediaFormatada = dadosMedia.media.toFixed(1);
        
        // Atualiza as estrelas existentes
        starsContainer.innerHTML = criarEstrelasParaPagina(dadosMedia.media);
        
        // Adiciona ou atualiza informações da média
        let infoMedia = reviewCard.querySelector('.rating-info');
        if (!infoMedia) {
            infoMedia = document.createElement('div');
            infoMedia.className = 'rating-info';
            reviewCard.appendChild(infoMedia);
        }
        
        infoMedia.innerHTML = `
            <div class="rating-details">
                <span class="rating-number">${mediaFormatada}</span>
                <span class="rating-count">(${dadosMedia.total} avaliação${dadosMedia.total > 1 ? 'ões' : ''})</span>
            </div>
        `;
    } else {
        // Se não há avaliações, mostra estrelas vazias
        starsContainer.innerHTML = criarEstrelasParaPagina(0);
        
        // Remove ou atualiza info se não há avaliações
        let infoMedia = reviewCard.querySelector('.rating-info');
        if (!infoMedia) {
            infoMedia = document.createElement('div');
            infoMedia.className = 'rating-info';
            reviewCard.appendChild(infoMedia);
        }
        
        infoMedia.innerHTML = `
            <div class="rating-details">
                <span class="no-reviews">Nenhuma avaliação ainda</span>
            </div>
        `;
    }
}

// SEU CÓDIGO ORIGINAL COM A CHAMADA ADICIONADA:
document.addEventListener('DOMContentLoaded', function() {     
    const urlParams = new URLSearchParams(window.location.search);     
    const itemId = urlParams.get('id');      

    const serviceImage = document.getElementById('service-detail-image');     
    const serviceTitle = document.getElementById('service-detail-title');     
    const serviceDescription = document.getElementById('service-detail-description');     
    const servicePrice = document.getElementById('service-detail-price');     
    const durationIcon = document.getElementById('duration-icon');     
    const durationValue = document.getElementById('duration-value'); // pode ser null     
    const serviceDurationElement = document.getElementById('service-detail-duration');      

    if (!itemId) {         
        console.error('ID do serviço não encontrado na URL.');         
        alert('Item não especificado. Redirecionando para a página inicial.');         
        window.location.href = '../aHome/home.html';         
        return;     
    }      

    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');     
    const selectedItem = produtos.find(item => item.id === itemId);      

    if (!selectedItem) {         
        console.error('Item com ID ' + itemId + ' não encontrado no localStorage.');         
        alert('Detalhes do item não encontrados. Redirecionando para a página inicial.');         
        window.location.href = '../aHome/home.html';         
        return;     
    }      

    // Preenche a UI (com proteções)     
    if (serviceImage) serviceImage.src = selectedItem.imagem || '';     
    if (serviceTitle) serviceTitle.textContent = selectedItem.titulo || '';     
    if (serviceDescription) serviceDescription.textContent = selectedItem.descricao || '';     
    if (servicePrice) servicePrice.textContent = `R$ ${parseFloat(selectedItem.preco).toFixed(2).replace('.', ',')}`;      

    if (selectedItem.tipo === 'servico' && selectedItem.duracao) {         
        if (durationValue) durationValue.textContent = `${selectedItem.duracao} MIN`;         
        if (serviceDurationElement) serviceDurationElement.style.display = 'inline-block';         
        if (durationIcon) durationIcon.style.display = 'inline-block';     
    } else if (selectedItem.tipo === 'oferta' && selectedItem.validade) {         
        if (durationValue) durationValue.textContent = `Válido até: ${new Date(selectedItem.validade).toLocaleDateString('pt-BR')}`;         
        if (serviceDurationElement) serviceDurationElement.style.display = 'inline-block';         
        if (durationIcon) durationIcon.style.display = 'none';     
    } else {         
        if (serviceDurationElement) serviceDurationElement.style.display = 'none';     
    }      

    // Botão Agendar — sempre verifique se existe antes     
    const scheduleButton = document.getElementById('schedule-button');     
    if (!scheduleButton) {         
        console.warn('Botão de agendar não encontrado (id="schedule-button").');         
        return;     
    }      

    scheduleButton.addEventListener('click', function () {         
        // salva o item completo no localStorage antes de redirecionar         
        localStorage.setItem('produtoSelecionado', JSON.stringify(selectedItem));         
        window.location.href = '../bAgendamento/Agend.html';     
    });      

    // ADICIONE ESTA LINHA para exibir a média das avaliações
    exibirMediaAvaliacoes();

    // DEBUG opcional     
    console.log('selectedItem:', selectedItem);     
    console.log('Schedule button attached:', !!scheduleButton); 
});