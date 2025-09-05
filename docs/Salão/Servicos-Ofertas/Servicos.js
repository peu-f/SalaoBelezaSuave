 let produtos = [];
        let editIndex = -1;

        // Carregar serviços quando a página abrir
        document.addEventListener('DOMContentLoaded', function() {
            carregarServicos();
            
            // Adicionar preview de imagem quando selecionar arquivo
            document.getElementById('editImagem').addEventListener('change', function(e) {
                const file = e.target.files[0];
                const preview = document.getElementById('imagePreview');
                
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `
                            <img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;" alt="Preview">
                            <p class="text-muted mt-1">Nova imagem selecionada</p>
                        `;
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.innerHTML = '';
                }
            });
        });

        // Carregar serviços do localStorage
        function carregarServicos() {
            produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            const container = document.getElementById('servicesContainer');
            
            if (produtos.length === 0) {
                container.innerHTML = '<p class="text-center">Nenhum serviço cadastrado ainda.</p>';
                return;
            }

            container.innerHTML = '';
            produtos.forEach((produto, index) => {
                const cardHTML = produto.tipo === 'servico' 
                    ? criarCardServico(produto, index)
                    : criarCardOferta(produto, index);
                container.innerHTML += cardHTML;
            });
        }

        // Criar card de serviço (CORRIGIDO - aspas fechadas corretamente)
        function criarCardServico(produto, index) {
            return `
                <div class="service-card">
                    <img src="${produto.imagem || 'https://via.placeholder.com/80'}" alt="${produto.titulo}" class="service-image">
                    <div class="service-details">
                        <h3 class="service-name">${produto.titulo}</h3>
                        <p class="service-description">${produto.descricao}</p>
                        <p class="service-info">Duração: ${produto.duracao || 'N/A'} min | R$ ${produto.preco}</p>
                        <div class="service-actions">
                            <button class="btn-edit" onclick="editarServico(${index})">Editar</button>
                            <button class="btn-delete" onclick="excluirServico(${index})">Excluir</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Criar card de oferta (CORRIGIDO - aspas fechadas corretamente)
        function criarCardOferta(produto, index) {
            const validadeFormatada = new Date(produto.validade).toLocaleDateString('pt-BR');
            return `
                <div class="service-card">
                    <img src="${produto.imagem || 'https://via.placeholder.com/80'}" alt="${produto.titulo}" class="service-image">
                    <div class="service-details">
                        <span class="offer-badge">OFERTA</span>
                        <h3 class="service-name">${produto.titulo}</h3>
                        <p class="service-description">${produto.descricao}</p>
                        <p class="service-info">R$ ${produto.preco} | Válido até: ${validadeFormatada}</p>
                        <div class="service-actions">
                            <button class="btn-edit" onclick="editarServico(${index})">Editar</button>
                            <button class="btn-delete" onclick="excluirServico(${index})">Excluir</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Abrir modal de edição
        function editarServico(index) {
            editIndex = index;
            const produto = produtos[index];
            
            document.getElementById('editIndex').value = index;
            document.getElementById('editTitulo').value = produto.titulo;
            document.getElementById('editDescricao').value = produto.descricao;
            document.getElementById('editPreco').value = produto.preco;
            
            // Limpar preview e input de arquivo
            document.getElementById('editImagem').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            
            // Se já tem imagem, mostrar preview
            if (produto.imagem) {
                document.getElementById('imagePreview').innerHTML = 
                    `<img src="${produto.imagem}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;" alt="Preview atual">
                     <p class="text-muted mt-1">Imagem atual</p>`;
            }
            
            // Mostrar campos específicos baseado no tipo
            if (produto.tipo === 'servico') {
                document.getElementById('duracaoField').style.display = 'block';
                document.getElementById('validadeField').style.display = 'none';
                document.getElementById('editDuracao').value = produto.duracao || '';
            } else {
                document.getElementById('duracaoField').style.display = 'none';
                document.getElementById('validadeField').style.display = 'block';
                document.getElementById('editValidade').value = produto.validade || '';
            }
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('editModal'));
            modal.show();
        }

        // Salvar edição
        function salvarEdicao() {
            if (editIndex === -1) return;
            
            const produto = produtos[editIndex];
            const fileInput = document.getElementById('editImagem');
            
            produto.titulo = document.getElementById('editTitulo').value;
            produto.descricao = document.getElementById('editDescricao').value;
            produto.preco = document.getElementById('editPreco').value;
            
            if (produto.tipo === 'servico') {
                produto.duracao = document.getElementById('editDuracao').value;
            } else {
                produto.validade = document.getElementById('editValidade').value;
            }
            
            // Se foi selecionado um novo arquivo
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    produto.imagem = e.target.result; // Salva como base64
                    localStorage.setItem('produtos', JSON.stringify(produtos));
                    finalizarEdicao();
                };
                
                reader.readAsDataURL(file);
            } else {
                // Se não foi selecionado novo arquivo, manter o atual
                localStorage.setItem('produtos', JSON.stringify(produtos));
                finalizarEdicao();
            }
        }
        
        // Função auxiliar para finalizar edição
        function finalizarEdicao() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            
            carregarServicos();
            alert('Serviço atualizado com sucesso!');
            editIndex = -1;
        }

        // Excluir serviço
        function excluirServico(index) {
            if (confirm('Tem certeza que deseja excluir este serviço?')) {
                produtos.splice(index, 1);
                localStorage.setItem('produtos', JSON.stringify(produtos));
                carregarServicos();
                alert('Serviço excluído com sucesso!');
            }
        }

        // Logout
        function logout() {
            localStorage.removeItem('saloes');
            window.location.href = '../../cliente/aInicio/boasVindas.html';
        }

        // FUNÇÃO PARA TESTAR - Adicionar alguns produtos de exemplo
        function adicionarProdutosExemplo() {
            const exemplos = [
                {
                    id: 1,
                    titulo: "Corte de Cabelo",
                    descricao: "Corte moderno e estiloso",
                    preco: "35.00",
                    duracao: 60,
                    imagem: "https://via.placeholder.com/80x80/8e44ad/ffffff?text=Corte",
                    tipo: "servico"
                },
                {
                    id: 2,
                    titulo: "Promoção Manicure",
                    descricao: "Manicure completa com desconto especial",
                    preco: "25.00",
                    validade: "2024-12-31",
                    imagem: "https://via.placeholder.com/80x80/dc3545/ffffff?text=Oferta",
                    tipo: "oferta"
                }
            ];
            
            localStorage.setItem('produtos', JSON.stringify(exemplos));
            carregarServicos();
        }