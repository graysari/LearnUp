
import axios from 'axios';

const API_BASE = 'https://mainserver.tail4c25a0.ts.net/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
