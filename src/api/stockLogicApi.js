import axios from 'axios';

const stockLogicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
}) 

export {stockLogicApi}