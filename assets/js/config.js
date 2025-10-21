const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://pardoxandria-api.devstao.dev';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export { API_BASE_URL, DEFAULT_HEADERS };
