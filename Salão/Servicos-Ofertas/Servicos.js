// Espera a página carregar para executar o código
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pega a lista de produtos que você salvou no outro formulário
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    // 2. Encontra o container no HTML onde os cards serão inseridos
    const servicesContainer = document.querySelector('.services-container');

    // Limpa qualquer card de exemplo que esteja no HTML
    servicesContainer.innerHTML = '';

    // 3. Se não houver produtos, exibe uma mensagem
    if (produtos.length === 0) {
        servicesContainer.innerHTML = '<p class="text-center">Nenhum serviço ou oferta cadastrado ainda.</p>';
        return; // Para a execução
    }

    // 4. Para cada produto na lista, cria o HTML do card correspondente
    produtos.forEach(produto => {
        let cardHTML = '';

        // 5. VERIFICA O TIPO E ESCOLHE QUAL CARD CRIAR
        if (produto.tipo === 'servico') {
            cardHTML = createServiceCardHTML(produto);
        } else if (produto.tipo === 'oferta') {
            cardHTML = createOfferCardHTML(produto);
        }

        // 6. Adiciona o HTML do card criado dentro do container na página
        servicesContainer.innerHTML += cardHTML;
    });
});


// --- Funções que criam o HTML de cada tipo de card ---

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

// Função para criar o HTML de um card de OFERTA
function createOfferCardHTML(produto) {
    // Formata a data para o padrão brasileiro (dd/mm/aaaa)
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