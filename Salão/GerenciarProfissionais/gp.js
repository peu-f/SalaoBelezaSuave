document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profissionalEmail = urlParams.get('email');
    if (!profissionalEmail) {
        window.location.href = '../Salao.html';
        return;
    }
    const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
    let profissionalSelecionado = profissionais.find(p => p.email === profissionalEmail);
    if (!profissionalSelecionado) {
        window.location.href = '../Salao.html';
        return;
    }
    const nomeElement = document.querySelector('.nomeprofissional');
    const especialidadeElement = document.querySelector('.servicos');
    const emailElement = document.getElementById('email-profissional');
    const telefoneElement = document.getElementById('telefone-profissional');
    const statusSelect = document.getElementById('status');
    const inicioInput = document.getElementById('inicio');
    const fimInput = document.getElementById('hfim');
    const salvarBtn = document.querySelector('.salvaralteracao');
    const imgContainer = document.querySelector('.profissional-container');
    const svgAvatar = imgContainer.querySelector('.person-circle');
    function preencherDadosProfissional() {
        if (profissionalSelecionado.fotoPerfil) {
            svgAvatar.style.display = 'none';
            let imgElement = imgContainer.querySelector('.profile-image');
            if (!imgElement) {
                imgElement = document.createElement('img');
                imgElement.classList.add('profile-image');
                imgContainer.prepend(imgElement);
            }
            imgElement.src = profissionalSelecionado.fotoPerfil;
            imgElement.alt = profissionalSelecionado.nome;
        } else {
            if(imgContainer.querySelector('.profile-image')) {
                imgContainer.querySelector('.profile-image').remove();
            }
            svgAvatar.style.display = 'block';
        }
        nomeElement.textContent = profissionalSelecionado.nome;
        especialidadeElement.textContent = profissionalSelecionado.especialidade;
        emailElement.textContent = profissionalSelecionado.email;
        telefoneElement.textContent = profissionalSelecionado.telefone;
        statusSelect.value = profissionalSelecionado.status || 'Disponivel';
        inicioInput.value = profissionalSelecionado.horaInicio;
        fimInput.value = profissionalSelecionado.horaFim;
    }
    preencherDadosProfissional();
    salvarBtn.addEventListener('click', function() {
        const novoStatus = statusSelect.value;
        const novoInicio = inicioInput.value;
        const novoFim = fimInput.value;
        const profissionalIndex = profissionais.findIndex(p => p.email === profissionalEmail);
        if (profissionalIndex !== -1) {
            profissionais[profissionalIndex].status = novoStatus;
            profissionais[profissionalIndex].horaInicio = novoInicio;
            profissionais[profissionalIndex].horaFim = novoFim;
            localStorage.setItem('profissionais', JSON.stringify(profissionais));
            alert('Dados do profissional atualizados com sucesso!');
        } else {
            alert('Erro: Profissional não encontrado para atualização.');
        }
    });
    const backButton = document.querySelector('.back-button');
    if(backButton){
      backButton.addEventListener('click', () => {
        
      });
    }
});