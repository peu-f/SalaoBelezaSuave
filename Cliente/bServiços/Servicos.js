document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    const serviceImage = document.getElementById('service-detail-image');
    const serviceTitle = document.getElementById('service-detail-title');
    const serviceDescription = document.getElementById('service-detail-description');
    const servicePrice = document.getElementById('service-detail-price');
    const serviceDurationElement = document.getElementById('service-detail-duration');
    const durationIcon = document.getElementById('duration-icon');
    const durationValue = document.getElementById('duration-value');

    if (!itemId) {
        console.error('ID do serviço/oferta não encontrado na URL. Verifique se home.js está passando o ID.');
        alert('Item não especificado. Redirecionando para a página inicial.');
        window.location.href = '../aHome/home.html';
        return;
    }

    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

    const selectedItem = produtos.find(item => item.id === itemId);

    if (!selectedItem) {
        console.error('Item com ID ' + itemId + ' não encontrado(a) no localStorage. Verifique se o item foi salvo corretamente na chave "produtos" e se o ID está correto.');
        alert('Detalhes do item não encontrados. Redirecionando para a página inicial.');
        window.location.href = '../aHome/home.html';
        return;
    }

    serviceImage.src = selectedItem.imagem;
    serviceTitle.textContent = selectedItem.titulo;
    serviceDescription.textContent = selectedItem.descricao;
    servicePrice.textContent = `R$ ${parseFloat(selectedItem.preco).toFixed(2).replace('.', ',')}`;

    if (selectedItem.tipo === 'servico' && selectedItem.duracao) {
        durationValue.textContent = `${selectedItem.duracao} MIN`;
        serviceDurationElement.style.display = 'inline-block';
        if (durationIcon) durationIcon.style.display = 'inline-block';

    } else if (selectedItem.tipo === 'oferta' && selectedItem.validade) {
        durationValue.textContent = `Válido até: ${new Date(selectedItem.validade).toLocaleDateString('pt-BR')}`;
        serviceDurationElement.style.display = 'inline-block';
        if (durationIcon) durationIcon.style.display = 'none';

    } else {
        serviceDurationElement.style.display = 'none';
    }

    const scheduleButton = document.getElementById('schedule-button');
    scheduleButton.onclick = function() {
        window.location.href = `../bAgendamento/Agend.html?itemId=${selectedItem.id}`;
    };
});