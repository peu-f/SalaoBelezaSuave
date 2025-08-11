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

    // DEBUG opcional
    console.log('selectedItem:', selectedItem);
    console.log('Schedule button attached:', !!scheduleButton);
});
