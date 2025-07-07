import axios from 'axios';

export async function loginViaApi(baseUrl: string, username: string, password: string) {
    const response = await axios.post(`${baseUrl}/api/login`, {
        username,
        password
    });
    return response.data;
} 