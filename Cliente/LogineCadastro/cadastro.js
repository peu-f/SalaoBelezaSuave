    function salvarUser(){
        const form = document.getElementById('login'); // pode renomear pra 'form-cadastro' se quiser
        form.addEventListener('submit', function (e) {
        e.preventDefault(); // impede o envio padrão
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirm').value;

            if (nome == '' && senha !== confirmarSenha){
                alert("Preencha todos os dados")
                return false
            } else{
                alert("Usuário cadastrado! Salve os dados da sessão para efetuar o login.")
                window.location.href = "../Home/home.html";
                return false
                const usuario = {
                nome,
                email,
                senha
                };

            localStorage.setItem('usuarioCadastrado', JSON.stringify(usuario));
            }}};