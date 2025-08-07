function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('usuarioCadastrado'); 

    // Redireciona para a página de boas-vindas
    window.location.href = '../aInicio/boasVindas.html';
}

// Funções da sidebar (mantidas)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        submenu.style.display = 'block';
    }
}

function criarSlideOferta(oferta, index) {
    const activeClass = index === 0 ? 'active' : '';
    return `
        <div class="slide ${activeClass}" id="slide-${oferta.id}">
            <a href="../bServiços/Servicos.html?id=${oferta.id}" class="oferta-link">
                <img src="${oferta.imagem}" alt="${oferta.titulo}" />
                <div class="oferta-info">
                    <h3>${oferta.titulo}</h3>
                    <p>Preço: R$ ${parseFloat(oferta.preco).toFixed(2)}</p>
                    <p>Válido até: ${new Date(oferta.validade).toLocaleDateString()}</p>
                    <p>Serviços Incluídos: ${oferta.servicosIncluidos.join(', ')}</p>
                </div>
            </a>
        </div>
    `;
}

function carregarOfertasNoCarrossel() {
    const ofertasContainer = document.getElementById('ofertas-carousel');
    const radiosContainer = document.getElementById('radios-container');
    const manualNavContainer = document.getElementById('manual-navigation');
    
    // Limpa o conteúdo existente para recarregar
    ofertasContainer.innerHTML = '';
    radiosContainer.innerHTML = '';
    manualNavContainer.innerHTML = '';

    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const ofertas = todosProdutos.filter(p => p.tipo === 'oferta');

    if (ofertas.length > 0) {
        ofertas.forEach((oferta, index) => {
            ofertasContainer.innerHTML += criarSlideOferta(oferta, index);
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'radio-btn';
            radioInput.id = `radio${index + 1}`;
            radioInput.classList.add('sliders-input');
            if (index === 0) radioInput.checked = true;
            radiosContainer.appendChild(radioInput);
            
            const manualLabel = document.createElement('label');
            manualLabel.htmlFor = `radio${index + 1}`;
            manualLabel.classList.add('manual-btn');
            manualNavContainer.appendChild(manualLabel);
        });

        let slideIndex = 1;
        const radios = document.querySelectorAll('.sliders-input');

        let autoSlide = setInterval(() => {
            slideIndex++;
            if (slideIndex > ofertas.length) {
                slideIndex = 1;
            }
            document.querySelector(`#radio${slideIndex}`).checked = true;
        }, 4000);

        radios.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                slideIndex = index + 1;
                clearInterval(autoSlide);
                autoSlide = setInterval(() => {
                    slideIndex++;
                    if (slideIndex > ofertas.length) {
                        slideIndex = 1;
                    }
                    document.querySelector(`#radio${slideIndex}`).checked = true;
                }, 4000);
            });
        });
    } else {
        ofertasContainer.innerHTML = '<p class="text-center mt-3">Nenhuma oferta cadastrada ainda.</p>';
    }
}


function criarCardServico(servico) {
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="Container" id="cardimg">
                        <img src="${servico.imagem}" alt="${servico.titulo}">
                    </div>
                    <h3 class="card-title">${servico.titulo}</h3>
                    <p class="card-text">${servico.descricao}</p>
                    <a href="../bServiços/Servicos.html?id=${servico.id}" class="btn btn-primary">Ver Detalhes</a>
                </div>
            </div>
        </div>
    `;
}

// Lógica principal
document.addEventListener('DOMContentLoaded', function() {
    
    // Carrega o carrossel de ofertas
    carregarOfertasNoCarrossel();

    // Carrega os cards de serviços
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const container = document.querySelector('.services-container'); 
    container.innerHTML = '';

    const servicos = produtos.filter(produto => produto.tipo === 'servico');

    if (servicos.length > 0) {
        servicos.forEach(servico => {
            let cardHTML = criarCardServico(servico);
            container.innerHTML += cardHTML;
        });
    } else {
        container.innerHTML = '<p class="text-center">Nenhum serviço cadastrado ainda.</p>';
    }
    
    // Lógica da barra de pesquisa
    const searchInput = document.querySelector('.search-input'); 
    const serviceContainer = document.querySelector('.services-container');
    searchInput.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toUpperCase();
        const serviceCards = serviceContainer.querySelectorAll('.card');
        serviceCards.forEach(card => {
            const cardTitleElement = card.querySelector('.card-title');

            if (cardTitleElement) {
                const tituloServico = cardTitleElement.textContent.toUpperCase();
                const isMatch = tituloServico.includes(termoBusca);
                card.style.display = isMatch ? '' : 'none';
            }
        });
    });
});