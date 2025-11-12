import { API_BASE_URL, DEFAULT_HEADERS } from './config.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('perfil-form');
    const uploadFoto = document.getElementById('upload_foto');
    const profilePicturePlaceholder = document.querySelector('.profile-picture-placeholder');
    const profileNamePreview = document.querySelector('.profile-name-preview');
    const profileEmailPreview = document.querySelector('.profile-email-preview');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmacaoSenhaInput = document.getElementById('confirmacao_senha');

    // Verificar se o usuário está autenticado
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        showToast('error', 'Erro', 'Você precisa estar logado para acessar esta página');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Carregar dados do usuário
    carregarDadosUsuario();

    // Preview e upload da foto de perfil
    uploadFoto.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                showToast('error', 'Erro', 'Por favor, selecione uma imagem válida');
                return;
            }

            // Validar tamanho do arquivo (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('error', 'Erro', 'A imagem deve ter no máximo 5MB');
                return;
            }

            // Preview da imagem
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicturePlaceholder.style.backgroundImage = `url(${e.target.result})`;
                profilePicturePlaceholder.style.backgroundSize = 'cover';
                profilePicturePlaceholder.innerHTML = '';
            };
            reader.readAsDataURL(file);

            // Upload imediato da imagem
            const userId = getUserIdFromToken(token);
            if (!userId) {
                showToast('error', 'Erro', 'Token inválido');
                return;
            }

            const avatarFormData = new FormData();
            avatarFormData.append('avatar', file);

            try {
                const avatarResponse = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: avatarFormData
                });

                if (avatarResponse.ok) {
                    showToast('success', 'Sucesso', 'Avatar atualizado com sucesso!');
                    const userData = await avatarResponse.json();
                    console.log('Avatar atualizado:', userData);
                    if (userData.user.avatar_url) {
                        sessionStorage.setItem('userAvatar', userData.user.avatar_url);
                    }
                } else {
                    const error = await avatarResponse.json();
                    console.error('Erro ao atualizar avatar:', error);
                    showToast('error', 'Erro', error.erro || 'Erro ao atualizar avatar');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('error', 'Erro', 'Erro ao conectar com o servidor');
            }
        }
    });

    // Preview do nome em tempo real
    nomeInput.addEventListener('input', function (e) {
        const nome = e.target.value.trim();
        profileNamePreview.textContent = nome || 'Seu Nome';
    });

    // Preview do email em tempo real
    emailInput.addEventListener('input', function (e) {
        const email = e.target.value.trim();
        profileEmailPreview.textContent = email || 'seu.email@exemplo.com';
    });

    // Submissão do formulário
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmacaoSenha = confirmacaoSenhaInput.value;

        // Validações
        if (!nome) {
            showToast('error', 'Erro', 'O nome é obrigatório');
            return;
        }

        if (!email) {
            showToast('error', 'Erro', 'O email é obrigatório');
            return;
        }

        if (!validarEmail(email)) {
            showToast('error', 'Erro', 'Por favor, insira um email válido');
            return;
        }

        // Validar senha se foi preenchida
        if (senha || confirmacaoSenha) {
            if (senha.length < 6) {
                showToast('error', 'Erro', 'A senha deve ter no mínimo 6 caracteres');
                return;
            }

            if (senha !== confirmacaoSenha) {
                showToast('error', 'Erro', 'As senhas não coincidem');
                return;
            }
        }

        // Decodificar token para obter o ID do usuário
        const userId = getUserIdFromToken(token);
        if (!userId) {
            showToast('error', 'Erro', 'Token inválido');
            return;
        }

        try {
            // Atualizar dados do usuário (nome e email)
            const updateResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email })
            });

            if (!updateResponse.ok) {
                const error = await updateResponse.json();
                console.error('Erro ao atualizar perfil:', error);
                showToast('error', 'Erro', error.erro || error.message || 'Erro ao atualizar perfil');
                return;
            }

            const userData = await updateResponse.json();

            showToast('success', 'Sucesso', 'Perfil atualizado com sucesso!');

            // Atualizar nome no sessionStorage
            if (userData.user && userData.user.nome) {
                sessionStorage.setItem('userName', userData.user.nome);
            }

            // Limpar campos de senha
            senhaInput.value = '';
            confirmacaoSenhaInput.value = '';

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 2000);

        } catch (error) {
            console.error('Erro:', error);
            showToast('error', 'Erro', 'Erro ao conectar com o servidor');
        }
    });

    // Função para carregar dados do usuário
    async function carregarDadosUsuario() {
        try {
            // Decodificar token para obter o ID do usuário
            const userId = getUserIdFromToken(token);
            if (!userId) {
                showToast('error', 'Erro', 'Token inválido');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const user = await response.json();

                // Preencher campos do formulário
                nomeInput.value = user.nome || '';
                emailInput.value = user.email || '';

                // Atualizar preview
                profileNamePreview.textContent = user.nome || 'Seu Nome';
                profileEmailPreview.textContent = user.email || 'seu.email@exemplo.com';

                // Se houver avatar, carregar
                if (user.avatar_url) {
                    const avatarUrl = user.avatar_url.startsWith('http')
                        ? user.avatar_url
                        : `${API_BASE_URL}${user.avatar_url}`;
                    profilePicturePlaceholder.style.backgroundImage = `url(${avatarUrl})`;
                    profilePicturePlaceholder.style.backgroundSize = 'cover';
                    profilePicturePlaceholder.innerHTML = '';
                }
            } else {
                const error = await response.json();
                console.error('Erro ao carregar dados:', error);
                showToast('error', 'Erro', 'Erro ao carregar dados do usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('error', 'Erro', 'Erro ao conectar com o servidor');
        }
    }

    // Função para decodificar JWT e obter ID do usuário
    function getUserIdFromToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            return payload.id;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    // Função auxiliar para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
