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

