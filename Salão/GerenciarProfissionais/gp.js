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
            
            // Elementos da página
            const nomeElement = document.querySelector('.nomeprofissional');
            const especialidadeField = document.getElementById('especialidade-profissional');
            const emailField = document.getElementById('email-profissional');
            const telefoneField = document.getElementById('telefone-profissional');
            const statusSelect = document.getElementById('status');
            const inicioInput = document.getElementById('inicio');
            const fimInput = document.getElementById('hfim');
            const salvarBtn = document.querySelector('.salvaralteracao');
            const photoContainer = document.querySelector('.photo-container');
            const defaultAvatar = document.getElementById('defaultAvatar');
            const photoInput = document.getElementById('photoInput');
            
            let novaFoto = null;
            
            // Função para exibir a foto do profissional
            function exibirFoto() {
                const imgExistente = photoContainer.querySelector('.profile-image');
                if (imgExistente) {
                    imgExistente.remove();
                }
                
                if (profissionalSelecionado.fotoPerfil || novaFoto) {
                    defaultAvatar.style.display = 'none';
                    
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('profile-image');
                    imgElement.src = novaFoto || profissionalSelecionado.fotoPerfil;
                    imgElement.alt = profissionalSelecionado.nome;
                    
                    photoContainer.insertBefore(imgElement, photoContainer.querySelector('.change-photo-btn'));
                } else {
                    defaultAvatar.style.display = 'block';
                }
            }
            
            // Preencher dados do profissional
            function preencherDadosProfissional() {
                nomeElement.textContent = profissionalSelecionado.nome;
                especialidadeField.textContent = profissionalSelecionado.especialidade || '';
                emailField.textContent = profissionalSelecionado.email || '';
                telefoneField.textContent = profissionalSelecionado.telefone || '';
                statusSelect.value = profissionalSelecionado.status || 'Disponivel';
                inicioInput.value = profissionalSelecionado.horaInicio || '';
                fimInput.value = profissionalSelecionado.horaFim || '';
                
                exibirFoto();
            }
            
            // Event listener para mudança de foto
            photoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                
                if (file) {
                    if (!file.type.startsWith('image/')) {
                        alert('Por favor, selecione apenas arquivos de imagem.');
                        return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                        alert('A imagem deve ter no máximo 5MB.');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        novaFoto = e.target.result;
                        exibirFoto();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Função para validar email
            function validarEmail(email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            }
            
            // Função para validar telefone
            function validarTelefone(telefone) {
                const telefoneNumeros = telefone.replace(/\D/g, '');
                return telefoneNumeros.length >= 10 && telefoneNumeros.length <= 11;
            }
            
            // Função para formatar telefone em tempo real
            function formatarTelefone(value) {
                const digits = value.replace(/\D/g, '');
                
                if (digits.length <= 2) {
                    return `(${digits}`;
                } else if (digits.length <= 7) {
                    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                } else if (digits.length <= 11) {
                    if (digits.length === 11) {
                        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                    } else {
                        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
                    }
                }
                
                return value;
            }
            
            // Formatar telefone ao digitar
            telefoneField.addEventListener('input', function() {
                const text = this.textContent;
                const formatted = formatarTelefone(text);
                if (formatted !== text) {
                    this.textContent = formatted;
                    // Manter cursor no final
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(this);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            });
            
            // Função para excluir profissional
            function excluirProfissional() {
                if (confirm('Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.')) {
                    const profissionalIndex = profissionais.findIndex(p => p.email === profissionalEmail);
                    
                    if (profissionalIndex !== -1) {
                        // Remove o profissional do array
                        profissionais.splice(profissionalIndex, 1);
                        
                        // Salva no localStorage
                        localStorage.setItem('profissionais', JSON.stringify(profissionais));
                        
                        alert('Profissional excluído com sucesso!');
                        
                        // Redireciona para a página anterior
                        window.location.href = '../Sinicio/Salao.html';
                    } else {
                        alert('Erro: Profissional não encontrado para exclusão.');
                    }
                }
            }
            document.getElementById('excluir').addEventListener('click', excluirProfissional);
            
            // Validação em tempo real para email
            emailField.addEventListener('input', function() {
                const email = this.textContent.trim();
                if (email && !validarEmail(email)) {
                    this.style.borderColor = '#dc3545';
                    this.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                } else {
                    this.style.borderColor = '';
                    this.style.backgroundColor = '';
                }
            });
            
            // Salvar alterações
            salvarBtn.addEventListener('click', function() {
                const novaEspecialidade = especialidadeField.textContent.trim();
                const novoEmail = emailField.textContent.trim();
                const novoTelefone = telefoneField.textContent.trim();
                const novoStatus = statusSelect.value;
                const novoInicio = inicioInput.value;
                const novoFim = fimInput.value;
                
                // Validações
                if (!novaEspecialidade) {
                    alert('Por favor, informe a especialidade do profissional.');
                    especialidadeField.focus();
                    return;
                }
                
                if (!novoEmail || !validarEmail(novoEmail)) {
                    alert('Por favor, informe um email válido.');
                    emailField.focus();
                    return;
                }
                
                if (!novoTelefone || !validarTelefone(novoTelefone)) {
                    alert('Por favor, informe um telefone válido.');
                    telefoneField.focus();
                    return;
                }
                
                if (!novoInicio || !novoFim) {
                    alert('Por favor, informe o horário de início e fim.');
                    return;
                }
                
                if (novoInicio >= novoFim) {
                    alert('O horário de início deve ser anterior ao horário de fim.');
                    return;
                }
                
                // Verificar se o email já existe (exceto para o próprio profissional)
                const emailExistente = profissionais.find(p => p.email === novoEmail && p.email !== profissionalEmail);
                if (emailExistente) {
                    alert('Este email já está sendo usado por outro profissional.');
                    emailField.focus();
                    return;
                }
                
                const profissionalIndex = profissionais.findIndex(p => p.email === profissionalEmail);
                
                if (profissionalIndex !== -1) {
                    // Atualizar dados
                    profissionais[profissionalIndex].especialidade = novaEspecialidade;
                    profissionais[profissionalIndex].email = novoEmail;
                    profissionais[profissionalIndex].telefone = novoTelefone;
                    profissionais[profissionalIndex].status = novoStatus;
                    profissionais[profissionalIndex].horaInicio = novoInicio;
                    profissionais[profissionalIndex].horaFim = novoFim;
                    
                    // Atualizar foto se foi alterada
                    if (novaFoto) {
                        profissionais[profissionalIndex].fotoPerfil = novaFoto;
                        profissionalSelecionado.fotoPerfil = novaFoto;
                        novaFoto = null;
                    }
                    
                    // Salvar no localStorage
                    localStorage.setItem('profissionais', JSON.stringify(profissionais));
                    
                    // Atualizar objeto local
                    profissionalSelecionado = profissionais[profissionalIndex];
                    
                    // Mostrar mensagem de sucesso
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
                    successAlert.innerHTML = `
                        <i class="bi bi-check-circle-fill me-2"></i>
                        Dados do profissional atualizados com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    
                    salvarBtn.parentNode.insertBefore(successAlert, salvarBtn);
                    
                    // Remover alerta após 3 segundos
                    setTimeout(() => {
                        if (successAlert.parentNode) {
                            successAlert.remove();
                        }
                    }, 3000);
                    
                    // Se o email foi alterado, atualizar URL
                    if (novoEmail !== profissionalEmail) {
                        const newUrl = new URL(window.location);
                        newUrl.searchParams.set('email', novoEmail);
                        window.history.replaceState({}, '', newUrl);
                    }
                    
                } else {
                    alert('Erro: Profissional não encontrado para atualização.');
                }
            });
            
            // Carregar dados iniciais
            preencherDadosProfissional();
            
            // Melhorar UX dos campos editáveis
            [especialidadeField, emailField, telefoneField].forEach(field => {
                field.addEventListener('focus', function() {
                    this.style.backgroundColor = 'white';
                });
                
                field.addEventListener('blur', function() {
                    this.style.backgroundColor = '';
                });
                
                // Evitar quebras de linha
                field.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                    }
                });
            });
        });