import apiClient from './http-common';
import { getHeaders } from '../globals';

export async function isSaxoTokenValid(){
    try {
        const headers = getHeaders();
        const data = {};
        const response = await apiClient.post('/authentication/isTokenValid', data, headers);
        return response.data;
    } catch (err) {
        return err;
    }
}