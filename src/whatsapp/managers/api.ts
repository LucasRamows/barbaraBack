import axios from "axios";

const api = axios.create({baseURL:"https://viewer.attosgreen.com.br/api/v1"})

export default api;