// Espera todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. ELEMENTOS PRINCIPAIS DA PÁGINA ---
    const container = document.querySelector('.services-container');
    const searchInput = document.querySelector('.search-input');
    
    // Elementos do filtro customizado
    const filterWrapper = document.querySelector('.input-group');
    const filterDisplay = document.getElementById('filter-display');
    const filterSelect = document.getElementById('filter-select');
    
    // --- 2. DADOS DO LOCALSTORAGE ---
    // ATENÇÃO: Verifique se a chave 'produtos' é a correta. Nos exemplos anteriores era 'produtosBelezaSuave'.
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];

    // ===============================================================
    // FUNÇÃO PARA APLICAR OS FILTROS E A BUSCA
    // ===============================================================
    // function aplicarFiltros() {
    //     const filtroSelecionado = filterSelect.value;
    //     const termoBusca = searchInput.value.toLowerCase();

    //     let produtosFiltrados = todosProdutos;

    //     // Etapa 1: Aplica o filtro do dropdown (serviço/oferta)
    //     if (filtroSelecionado) { // Se um filtro foi selecionado (não está vazio)
    //         produtosFiltrados = produtosFiltrados.filter(p => p.tipo === filtroSelecionado);
    //     }

    //     // Etapa 2: Aplica o filtro da barra de busca sobre o resultado anterior
    //     if (termoBusca) {
    //         produtosFiltrados = produtosFiltrados.filter(p => 
    //             p.titulo.toLowerCase().includes(termoBusca)
    //         );
    //     }

    //     renderizarCards(produtosFiltrados);
    // }

    // ===============================================================
    // FUNÇÃO QUE DESENHA OS CARDS NA TELA
    // ===============================================================
    function renderizarCards(listaDeProdutos) {
        container.innerHTML = ''; 

        if (listaDeProdutos.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhum item encontrado.</p>';
            return;
        }

        listaDeProdutos.forEach(produto => {
            let cardHTML = '';
            if (produto.tipo === 'servico') {
                cardHTML = criarCardServico(produto);
            } else if (produto.tipo === 'oferta') {
                cardHTML = criarCardOferta(produto);
            }
            container.innerHTML += cardHTML;
        });
    }
    
    // --- 3. CONFIGURAÇÃO DOS "OUVINTES" (GATILHOS) ---
    
    // Gatilho para a barra de pesquisa
    // searchInput.addEventListener('input', aplicarFiltros);
    
    // Gatilho para o dropdown customizado
    // filterWrapper.addEventListener('click', function(event) {
    //     if (event.target.classList.contains('dropdown-item')) {
    //         event.preventDefault();
            
    //         const selectedValue = event.target.getAttribute('data-value');
    //         const selectedText = event.target.textContent;

    //         // Atualiza os campos visuais e o select escondido
    //         filterDisplay.value = (selectedValue === "") ? "" : selectedText;
    //         filterDisplay.placeholder = (selectedValue === "") ? "Filtrar por..." : selectedText;
    //         filterSelect.value = selectedValue;
            
    //         // Chama a função principal de filtro
    //         aplicarFiltros();
    //     }
    // });

    // --- 4. CARGA INICIAL ---
    // Desenha todos os cards na tela pela primeira vez
    renderizarCards(todosProdutos);
});


// ======================================================
// FUNÇÕES QUE CRIAM O HTML DOS CARDS
// ======================================================

function criarCardServico(servico) {
    const servicoId = servico.id || encodeURIComponent(servico.dataCadastro);
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="Container" id="cardimg">
                        <img src="${servico.imagem}" alt="${servico.titulo}">
                    </div>
                    <h3 class="card-title">${servico.titulo}</h3>
                    <p class="card-text">${servico.descricao}</p>
                    <a href="../bServiços/Servicos.html?id=${servicoId}" class="btn btn-primary">Ver Detalhes</a>
                </div>
            </div>
        </div>
    `;
}

function criarCardOferta(oferta) {
    const ofertaId = oferta.id || encodeURIComponent(oferta.dataCadastro);
    const validadeFormatada = new Date(oferta.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 offer-card">
                <div class="card-body">
                    <span class="offer-badge">OFERTA</span>
                    <div class="Container" id="cardimg">
                        <img src="${oferta.imagem}" alt="${oferta.titulo}">
                    </div>
                    <h3 class="card-title">${oferta.titulo}</h3>
                    <p class="card-text">${oferta.descricao}</p>
                    <p class="offer-validity">Válido até: ${validadeFormatada}</p>
                    <a href="../bServiços/Servicos.html?id=${ofertaId}" class="btn btn-primary">Ver Oferta</a>
                </div>
            </div>
        </div>
    `;
}

function logout() {
    localStorage.removeItem('usuarioCadastrado'); 
    window.location.href = '../../../index.html';
}