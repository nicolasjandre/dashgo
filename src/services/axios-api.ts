import axios, { AxiosError } from 'axios';
import { setCookie, parseCookies } from "nookies";
import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies();
let isRefreshing: boolean = false;
let failedRequestsQueue: any[] = []

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const authApi = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['dashgo.token']}`,
    }
})

authApi.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    if (error.response?.status === 401) {
        if (error.response.data?.code === 'token.expired') {
            cookies = parseCookies();

            const { "dashgo.refreshToken": refreshToken } = parseCookies();
            const originalConfig = error.config

            if (!isRefreshing) {
                isRefreshing = true;

                authApi.post('/refresh', {
                    refreshToken,
                }).then(response => {
                    const { token } = response.data

                    setCookie(undefined, "dashgo.token", token, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: "/",
                    });
                    setCookie(undefined, "dashgo.refreshToken", response.data.refreshToken, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: "/",
                    });

                    authApi.defaults.headers['Authorization'] = `Bearer ${token}`;

                    failedRequestsQueue.forEach(request => request.onSucess(token))
                    failedRequestsQueue = []
                })
                    .catch(error => {
                        failedRequestsQueue.forEach(request => request.onFailure(error))
                        failedRequestsQueue = []
                    })
                    .finally(() => isRefreshing = false)
            }

            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    onSucess: (token: string) => {
                        originalConfig!.headers['Authorization'] = `Bearer ${token}`

                        resolve(authApi(originalConfig!))
                    },
                    onFailure: (error = AxiosError) => {
                        reject(error)
                    }
                })
            })
        }

    } else {
        signOut()
    }

    return Promise.reject(error)
});