import axios from 'axios';

export const api = axios.create({
    baseURL: "http://jandash.vercel.app/api"
})