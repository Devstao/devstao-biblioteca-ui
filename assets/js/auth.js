import { API_BASE_URL } from './config.js';

function login(email, password) {
    return fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    });
}
export { login };