// Espera todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA MOSTRAR/ESCONDER OS CAMPOS DO FORMULÁRIO ---
    
    // 1. Pega os elementos principais do HTML
    const tipoSelect = document.getElementById('tipo'); // Corrigido: getElementById
    const servicoSection = document.getElementById('servicoSection');
    const ofertaSection = document.getElementById('ofertaSection');

    // 2. Adiciona um "ouvinte" que percebe quando o valor do select muda
    tipoSelect.addEventListener('change', function() {
        
        // Esconde ambas as seções para "limpar" o formulário
        servicoSection.style.display = 'none';
        ofertaSection.style.display = 'none';

        // Pega o valor da opção selecionada ("servico" ou "oferta")
        const valorSelecionado = this.value;

        // 3. Verifica o valor e mostra a seção correspondente
        if (valorSelecionado === 'servico') {
            servicoSection.style.display = 'block'; // Mostra a seção de serviço
        } else if (valorSelecionado === 'oferta') {
            ofertaSection.style.display = 'block'; // Mostra a seção de oferta
        }
    });

    // --- LÓGICA PARA PRÉ-VISUALIZAÇÃO DA IMAGEM ---

    document.getElementById('fotoServico').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const preview = document.getElementById('previewImage');
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block'; // Mostra a imagem
            
            const fileNameSpan = document.getElementById('fileName');
            fileNameSpan.textContent = file.name; // Mostra o nome do arquivo
        }
    });

    // --- LÓGICA PARA ENVIAR O FORMULÁRIO ---

    document.getElementById('serviceForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const form = e.target;
        const tipo = document.getElementById('tipo').value; // Pega o VALOR do select
        const imagem = document.getElementById('fotoServico').files[0];

        if (!tipo || !imagem) {
            alert('Preencha o tipo e selecione uma imagem!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const produto = {
                tipo: tipo, 
                imagem: event.target.result,
                dataCadastro: new Date().toISOString()
            };

            // Adiciona os dados específicos de cada tipo(adiciona ao localstorage)
            if (tipo === 'servico') {
                produto.titulo = document.getElementById('tituloServico').value;
                produto.descricao = document.getElementById('descricaoServico').value;
                produto.preco = document.getElementById('precoServico').value;
                produto.duracao = document.getElementById('duracaoServico').value;
            } else if (tipo === 'oferta') {
                produto.titulo = document.getElementById('tituloOferta').value;
                produto.descricao = document.getElementById('descricaoOferta').value;
                produto.preco = document.getElementById('precoOferta').value;
                produto.validade = document.getElementById('validadeOferta').value;
                // Para o select 
                const selectedServices = document.getElementById('servicosIncluidos').selectedOptions;
                produto.servicosIncluidos = Array.from(selectedServices).map(option => option.value);
            }

            const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

            produtos.push(produto);

            localStorage.setItem('produtos', JSON.stringify(produtos));

            alert('Cadastro realizado com sucesso!');
            form.reset();
            document.getElementById('previewImage').style.display = 'none'; // Esconde a preview
            document.getElementById('fileName').textContent = 'Clique para adicionar uma imagem'; // Reseta o nome
            // window.location.href = 'servicos.html'; // Descomente se quiser redirecionar
        };

        reader.readAsDataURL(imagem);
    });
});