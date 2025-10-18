import { showToast } from './toast.js';
import { API_BASE_URL, DEFAULT_HEADERS } from './config.js';
import { checkAuth } from './auth.js';

let currentLivro = null;
let userVote = 0;

const categoriaLabels = {
    'ficcao': 'Ficção',
    'romance': 'Romance',
    'ficcao-cientifica': 'Ficção Científica',
    'fantasia': 'Fantasia',
    'misterio': 'Mistério',
    'horror': 'Horror',
    'thriller': 'Thriller',
    'nao-ficcao': 'Não Ficção',
    'politico': 'Político',
    'biografia': 'Biografia',
    'outros': 'Outros'
};

async function getLivroById(id) {
    try {
        const token = localStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/livros/${id}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch livro details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function submitVotacao(livroId, nota) {
    try {
        const token = localStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/votacoes`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                livro_id: livroId,
                nota: nota
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit vote');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function renderStars(rating, containerId) {
    const container = document.getElementById(containerId);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="material-icons star star-filled">star</span>';
    }
    if (hasHalfStar) {
        starsHTML += '<span class="material-icons star star-half">star_half</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="material-icons star">star_border</span>';
    }

    container.innerHTML = starsHTML;
}

function setupVoteStars() {
    const voteStars = document.querySelectorAll('.vote-star');

    voteStars.forEach((star, index) => {
        star.addEventListener('click', function () {
            const value = parseFloat(this.getAttribute('data-value'));
            userVote = value;

            voteStars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseenter', function () {
            voteStars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = 'var(--amarelo)';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    const voteContainer = document.getElementById('vote-stars');
    voteContainer.addEventListener('mouseleave', function () {
        voteStars.forEach((s, index) => {
            if (!s.classList.contains('active')) {
                s.style.color = '#ddd';
            }
        });
    });
}

window.submitVote = async function () {
    if (userVote === 0) {
        showToast('error', 'Erro', 'Por favor, selecione uma avaliação');
        return;
    }

    const btnVote = document.getElementById('btn-vote');
    btnVote.disabled = true;
    btnVote.textContent = 'Enviando...';

    try {
        await submitVotacao(currentLivro.id, userVote);
        showToast('success', 'Sucesso', 'Avaliação enviada com sucesso!');

        // Recarregar dados do livro para atualizar rating
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error) {
        showToast('error', 'Erro', 'Não foi possível enviar a avaliação');
        btnVote.disabled = false;
        btnVote.textContent = 'Enviar Avaliação';
    }
}

window.lerLivro = function () {
    if (currentLivro && currentLivro.arquivo_url) {
        window.open(currentLivro.arquivo_url, '_blank');
    } else {
        showToast('error', 'Erro', 'Arquivo do livro não disponível');
    }
}

window.baixarLivro = function () {
    if (currentLivro && currentLivro.arquivo_url) {
        const link = document.createElement('a');
        link.href = currentLivro.arquivo_url;
        link.download = `${currentLivro.titulo}.pdf`;
        link.click();
    } else {
        showToast('error', 'Erro', 'Arquivo do livro não disponível');
    }
}

window.loadLivroDetails = async function () {
    if (!checkAuth()) return;

    // Pegar o ID do livro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get('id');

    if (!livroId) {
        showToast('error', 'Erro', 'ID do livro não encontrado');
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 2000);
        return;
    }

    try {
        const livro = await getLivroById(livroId);
        currentLivro = livro;

        // Preencher informações
        document.getElementById('livro-titulo').textContent = livro.titulo || 'Sem título';
        document.getElementById('livro-autor').textContent = livro.nome_autor || 'Autor desconhecido';

        if (livro.capa_url) {
            document.getElementById('livro-capa').src = livro.capa_url;
        }

        // Meta informações
        const metaHTML = [];
        if (livro.ano_publicacao) {
            metaHTML.push(`
                <div class="livro-meta-item">
                    <span class="material-icons">calendar_today</span>
                    ${livro.ano_publicacao}
                </div>
            `);
        }
        if (livro.editora) {
            metaHTML.push(`
                <div class="livro-meta-item">
                    <span class="material-icons">business</span>
                    ${livro.editora}
                </div>
            `);
        }
        document.getElementById('livro-meta').innerHTML = metaHTML.join('');

        // Rating
        const rating = livro.media_votos || 0;
        const totalVotos = livro.total_votos || 0;
        document.getElementById('rating-number').textContent = Number(rating).toFixed(1);
        document.getElementById('rating-count').textContent = `(${totalVotos} voto${totalVotos !== 1 ? 's' : ''})`;
        renderStars(rating, 'current-rating-stars');

        // Descrição
        if (livro.descricao) {
            document.getElementById('livro-descricao').textContent = livro.descricao;
            document.getElementById('livro-descricao-section').style.display = 'block';
        }

        // Detalhes
        document.getElementById('livro-isbn').textContent = livro.isbn || '-';
        document.getElementById('livro-edicao').textContent = livro.edicao || '-';
        document.getElementById('livro-ano').textContent = livro.ano_publicacao || '-';
        document.getElementById('livro-editora').textContent = livro.editora || '-';

        const categoriaLabel = categoriaLabels[livro.categoria] || livro.categoria || 'Outros';
        document.getElementById('livro-categoria').innerHTML = `<span class="category-badge">${categoriaLabel}</span>`;

        // Desabilitar botão de ler se não houver arquivo
        if (!livro.arquivo_url) {
            document.getElementById('btn-ler').disabled = true;
            document.getElementById('btn-ler').style.opacity = '0.5';
        }

        // Mostrar conteúdo
        document.getElementById('loading').style.display = 'none';
        document.getElementById('livro-content').style.display = 'block';

        // Setup vote stars
        setupVoteStars();

    } catch (error) {
        showToast('error', 'Erro', 'Não foi possível carregar os detalhes do livro');
        console.error('Error loading livro details:', error);
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 2000);
    }
}
