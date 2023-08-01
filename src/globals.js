export const baseUrl = "http://localhost:1337";

export function setAuthInfo(token, name, mail){
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('email', mail);
}

export function getAuthToken(){
    return sessionStorage.getItem('authToken');
}

export function getUserName(){
    return sessionStorage.getItem('userName');
}

export function getEmail(){
    return sessionStorage.getItem('email');
}

export function removeCredentials(){
    sessionStorage.removeItem('authToken', '');
    sessionStorage.removeItem('userName', '');
    sessionStorage.removeItem('email', '');
}

export function getHeaders() {
    const authToken = getAuthToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${authToken}` }
    };
    return headers;
}
