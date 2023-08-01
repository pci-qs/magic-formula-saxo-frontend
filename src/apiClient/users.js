import apiClient from './http-common';
import { setAuthInfo, getHeaders } from '../globals';

export async function login(email, password) {
    const data = JSON.stringify({
        email, password
    });
    try {
        const response = await apiClient.post('/login', data);
        const result = {
            status: response.status,
            name: response.data.info.name,
            email: response.data.info.email,
            auth_token: response.data.auth_token,
        };
        if (result.status === 200)
            setAuthInfo(result.auth_token, result.name, result.email);

        return result;
    } catch (err) {
        return err;
    }
}

export async function logout() {
    try {
        const headers = getHeaders();
        const data = {};
        const response = await apiClient.post('/logout', data, headers);
        return response;
    } catch (err) {
        return err;
    }
}