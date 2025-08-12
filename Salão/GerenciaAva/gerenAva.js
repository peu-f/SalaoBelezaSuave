function logout() {
    // Limpa o que foi salvo localmente
    localStorage.removeItem('saloes'); // ou clear()
  
    // Aqui já dá pra colocar chamada à API de logout quando tiver backend:
    // fetch('/api/logout', { method: 'POST', credentials: 'include' })
    //   .then(() => {
    //     // redireciona depois que o servidor confirmar logout
    //     window.location.href = '/login.html';
    //   });
  
    // Por enquanto, só redireciona direto
    window.location.href = '../aInicio/boasVindas.html';
  }

  function listarAvaliacoes() {
    const avaliacao = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    const container = document.getElementById('listarAvaliacoes');
    
    container.innerHTML = ''; // Limpa o conteúdo anterior
  
    if(avaliacao.length === 0){
      container.innerHTML = '<p class="text-center m-4">Nenhum profissional cadastrado ainda.<p/>'
      return;
    }
  
    avaliacao.forEach(avaliacao => {
      const card = document.createElement('div');
      card.className = 'card h-100';
      card.innerHTML = `
      <h5 class="card-title">${avaliacao.clienteNome} ID:</h5>
      <p class="card-text">Serviço: </p>
      <p class="card-text">"Comentário"</p>
      <div class="rating m-4">
        <i class="bi bi-star star" data-value="1"></i>
        <i class="bi bi-star star" data-value="2"></i>
        <i class="bi bi-star star" data-value="3"></i>
        <i class="bi bi-star star" data-value="4"></i>
        <i class="bi bi-star star" data-value="5"></i>
    </div>
      <div class="buttons">
      <button type="button" class="btn">Publicar avaliação</button>
      <button class="btn" id="deleteAva">Excluir avaliação</button>
    </div>
    </div>`;
        container.appendChild(card);
    });              
  }
  document.addEventListener("DOMContentLoaded", listarAvaliacoes);