export interface LoginRequest {
    email: string;
    password: string;
}

export const login = async (loginRequest: LoginRequest) => {
    return fetch('/api/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
    }).then((response) => {
        if (!response.ok) {
            return response.text()
                .then(result => Promise.reject(result));
        }

        return response.json()
            .then(result => result.accessToken);
    }).catch((err) => {
        return Promise.reject(err);
    });
}