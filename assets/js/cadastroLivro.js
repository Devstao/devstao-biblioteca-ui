import { API_BASE_URL, DEFAULT_HEADERS } from './config.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const uploadLivro = document.getElementById('upload_livro');
    const uploadCapa = document.getElementById('upload_capa');
    const bookCoverPlaceholder = document.querySelector('.book-cover-placeholder');
    const bookTitlePreview = document.querySelector('.book-title-preview');
    const tituloInput = document.getElementById('titulo');

    uploadCapa.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                bookCoverPlaceholder.style.backgroundImage = `url(${e.target.result})`;
                bookCoverPlaceholder.style.backgroundSize = 'cover';
                bookCoverPlaceholder.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    tituloInput.addEventListener('input', function (e) {
        bookTitlePreview.textContent = e.target.value || 'Pardo Jobs - A biografia não autorizada';
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append('titulo', document.getElementById('titulo').value);
        formData.append('nome_autor', document.getElementById('nome_autor').value);
        formData.append('editora', document.getElementById('editora').value);
        formData.append('ano_publicacao', document.getElementById('ano_publicacao').value);
        formData.append('isbn', document.getElementById('isbn').value);
        formData.append('edicao', document.getElementById('edicao').value);
        formData.append('local_publicacao', document.getElementById('local_publicacao').value);
        formData.append('exemplar', document.getElementById('exemplar').value);

        if (uploadLivro.files[0]) {
            formData.append('arquivo_livro', uploadLivro.files[0]);
        }
        if (uploadCapa.files[0]) {
            formData.append('capa', uploadCapa.files[0]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/livros`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Sucesso', 'Livro cadastrado com sucesso!');
                form.reset();
                bookCoverPlaceholder.style.backgroundImage = '';
                bookCoverPlaceholder.innerHTML = '<i class="material-icons">photo_size_select_actual</i>';
                bookTitlePreview.textContent = 'Pardo Jobs - A biografia não autorizada';
                window.location.href = 'app';
            } else {
                const error = await response.json();
                console.error('Erro ao cadastrar livro:', error);
                showToast('error', 'Erro', 'Erro ao cadastrar: ' + (error.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('error', 'Erro', 'Erro ao conectar com o servidor');
        }
    });
});
