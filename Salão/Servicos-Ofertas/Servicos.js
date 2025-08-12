// Espera a página carregar para executar o código
document.addEventListener('DOMContentLoaded', function() {

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const servicesContainer = document.querySelector('.services-container');
    servicesContainer.innerHTML = '';
    if (produtos.length === 0) {
        servicesContainer.innerHTML = '<p class="text-center">Nenhum serviço ou oferta cadastrado ainda.</p>';
        return;
    }
    // 4. Para cada produto na lista, cria o HTML do card correspondente
    produtos.forEach(produto => {
        let cardHTML = '';
        if (produto.tipo === 'servico') {
            cardHTML = createServiceCardHTML(produto);
        } else if (produto.tipo === 'oferta') {
            cardHTML = createOfferCardHTML(produto);
        }

        // 6. Adiciona o HTML do card criado dentro do container na página
        servicesContainer.innerHTML += cardHTML;
    });
});

// Função para criar o HTML de um card de SERVIÇO
function createServiceCardHTML(produto) {
    return `
        <section class="service-card">
            <div class="service-details">
                <h3 class="service-name">${produto.titulo}</h3>
                <p class="service-description">${produto.descricao}</p>
                <p class="service-info">Duração: ${produto.duracao || 'N/A'} min | Preço: R$ ${produto.preco}</p>
                <button class="btn-edit">Editar</button>
            </div>
            <div class="service-image-container">
                <img src="${produto.imagem}" alt="${produto.titulo}" class="service-image">
            </div>
        </section>
    `;
}


function createOfferCardHTML(produto) {
    const validadeFormatada = new Date(produto.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return `
        <section class="service-card offer-card">
            <div class="service-details">
                <span class="offer-badge">OFERTA</span>
                <h3 class="service-name">${produto.titulo}</h3>
                <p class="service-description">${produto.descricao}</p>
                <p class="service-info">Preço: R$ ${produto.preco}</p>
                <p class="offer-validity">Válido até: ${validadeFormatada}</p>
                <button class="btn-edit">Ver Oferta</button>
            </div>
            <div class="service-image-container">
                <img src="${produto.imagem}" alt="${produto.titulo}" class="service-image">
            </div>
        </section>
    `;
}
function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('saloes');  // ou clear()
  
    // Aqui já dá pra colocar chamada à API de logout quando tiver backend:
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(() => {
    //     // redireciona depois que o servidor confirmar logout
    //     window.location.href = '/login.html';
    //   });
  
    // Por enquanto, só redireciona direto
    window.location.href = '../../cliente/aInicio/boasVindas.html';
  }