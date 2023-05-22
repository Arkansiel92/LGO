function saveToken(token: string) {
    localStorage.setItem('token', token);
}

function logout() {
    localStorage.removeItem('token');
}

function isLogged() {
    let token = localStorage.getItem('token');

    return !!token;
}

export const accountServices = {
    saveToken, logout, isLogged
}