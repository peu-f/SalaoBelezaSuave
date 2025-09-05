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
document.addEventListener('DOMContentLoaded', function() { 

})

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
                <span class="rating-number" style="color: ${getCorPorNota(dadosMedia.media)};">${mediaFormatada}</span>
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

// Função auxiliar para obter cor baseada na nota
function getCorPorNota(rating) {
    const notaArredondada = Math.round(rating);
    
    if (notaArredondada <= 2) {
        return '#dc3545'; // vermelho
    } else if (notaArredondada === 3) {
        return '#fd7e14'; // laranja
    } else if (notaArredondada === 4) {
        return '#ffc107'; // dourado
    } else {
        return '#28a745'; // verde
    }
}

// Função para criar estrelas compatíveis com o HTML da página
function criarEstrelasParaPagina(rating) {
    const notaArredondada = Math.round(rating);
    let cor = '';
    
    // Define cor baseada na nota
    if (notaArredondada <= 2) {
        cor = '#dc3545'; // vermelho para notas baixas (1-2)
    } else if (notaArredondada === 3) {
        cor = '#fd7e14'; // laranja para nota média (3)
    } else if (notaArredondada === 4) {
        cor = '#ffc107'; // dourado para nota boa (4)
    } else {
        cor = '#28a745'; // verde para nota excelente (5)
    }
    
    let estrelasHTML = '';
    // Mostra apenas o número de estrelas correspondente à nota
    for (let i = 1; i <= notaArredondada; i++) {
        estrelasHTML += `<span class="star filled" style="color: ${cor};">&#9733;</span>`;
    }
    
    return estrelasHTML;
}

// Para usar na página do serviço - adicione no seu DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
    // ... seu código existente ...
    
    // Adicione esta linha para mostrar a média
    exibirMediaAvaliacoes();
});

// Para atualizar a média após uma nova avaliação ser publicada
// (adicione no final da função publicarAvaliacao)
function publicarAvaliacao(index) {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    
    if (index < avaliacoes.length) {
        // Marcar como publicada
        avaliacoes[index].publicada = true;
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        
        alert('Avaliação publicada com sucesso!');
        listarAvaliacoes(); // Recarrega a lista
        
        // Atualiza a média se estivermos na página do serviço
        if (typeof exibirMediaAvaliacoes === 'function') {
            exibirMediaAvaliacoes();
        }
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
    const durationValue = document.getElementById('service-detail-duration');    
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

    // CORREÇÃO AQUI: Garantir que a duração seja atualizada corretamente
    if (selectedItem.tipo === 'servico' && selectedItem.duracao) {         
        if (durationValue) {
            durationValue.textContent = `${selectedItem.duracao} MIN`;
            console.log('Duração definida:', selectedItem.duracao); // Para debug
        }             
    } else if (selectedItem.tipo === 'oferta' && selectedItem.validade) {         
        if (durationValue) {
            durationValue.textContent = `Válido até: ${new Date(selectedItem.validade).toLocaleDateString('pt-BR')}`;
        }
        if (serviceDurationElement) serviceDurationElement.style.display = 'inline-block';         
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