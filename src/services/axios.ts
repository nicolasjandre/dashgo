import axios from 'axios';

export const api = axios.create({
    baseURL: "https://jandash.vercel.app/"
})