function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('usuarioCadastrado'); // ou clear()
  
    // Aqui já dá pra colocar chamada à API de logout quando tiver backend:
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(() => {
    //     // redireciona depois que o servidor confirmar logout
    //     window.location.href = '/login.html';
    //   });
  
    // Por enquanto, só redireciona direto
    window.location.href = '../aInicio/boasVindas.html';
  }

  

// Vai controlar o índice do slide atual
let slideIndex = 1;

// Pega os inputs radio do carrossel
const radios = document.querySelectorAll('.sliders-input');

// Função para ativar um slide específico (1 a 4)
function showSlide(n) {
  if (n > radios.length) slideIndex = 1;
  else if (n < 1) slideIndex = radios.length;
  else slideIndex = n;

  radios[slideIndex - 1].checked = true;
}

// Passa para o próximo slide
function nextSlide() {
  showSlide(slideIndex + 1);
}

// Loop automático a cada 4 segundos
let autoSlide = setInterval(nextSlide, 4000);

// Se o usuário clicar em algum botão manual, reseta o timer
radios.forEach((radio, index) => {
  radio.addEventListener('change', () => {
    slideIndex = index + 1;
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 4000);
  });
});

// Funções da sidebar que você já usa (para não quebrar seu código)
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  if (submenu.style.display === 'block') submenu.style.display = 'none';
  else submenu.style.display = 'block';
}


//mostrar serviçoes reais
// Espera todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Use o nome correto que você salvou no localStorage
    const servicos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const container = document.querySelector('.services-container'); 
    container.innerHTML = '';

    if (servicos.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhum serviço ou oferta cadastrado ainda.</p>';
        return;
    }

    // Para cada item na lista de 'servicos'
    servicos.forEach(servico => {
        let cardHTML = '';

        // Compara o tipo do serviço (usando '===')
        if (servico.tipo === 'servico') {
            cardHTML = criarCardServico(servico);
        } else if (servico.tipo === 'oferta') {
            // Adicione aqui a função para criar o card de oferta se necessário
            // cardHTML = criarCardOferta(servico); 
        }

        // Adiciona o HTML do novo card ao container
        container.innerHTML += cardHTML;
    });
});

// Função que cria o HTML do card de um serviço
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