function carregarPerfil() {

    const usuarioLogadoId = localStorage.getItem('usuarioLogadoId');
    const usuarios = JSON.parse(localStorage.getItem('usuarioCadastrado')) || [];
    const usuarioAtual = usuarios.find(usuario => usuario.id == usuarioLogadoId);

    if (usuarioAtual) {
        document.querySelector('.container.user-profile h2').textContent = usuarioAtual.nome;

        const infosDiv = document.getElementById('infos');
        infosDiv.innerHTML = `
            <span>Email: <p>${usuarioAtual.email}</p></span>
            <span>Telefone: <p>${usuarioAtual.telefone}</p></span>
            <span>Senha: <p>**************</p></span>
        `;
    } else {
        alert('Usuário não logado ou não encontrado.');
    }
}

window.onload = carregarPerfil;