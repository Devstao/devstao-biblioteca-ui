import { API_BASE_URL, DEFAULT_HEADERS } from './config.js';
async function getEscritores() {
    try {
        const token = sessionStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/users/escritores`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch escritores');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getLivrosByEscritor(escritorId) {
    try {
        const token = sessionStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/users/${escritorId}/livros`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch livros by escritor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getLivros() {
    try {
        const token = sessionStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/livros`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch livros');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function filterLivros(parameters) {
    const query = new URLSearchParams(parameters).toString();

    try {
        const token = sessionStorage.getItem('authToken');
        const headers = {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/livros?${query}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to filter livros');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getLivroById(id) {
    try {
        const token = sessionStorage.getItem('authToken');
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

export { getEscritores, getLivrosByEscritor, getLivros, filterLivros, getLivroById };