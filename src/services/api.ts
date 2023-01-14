import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3002',
  // baseURL: 'http://3.132.7.16:3333',
  baseURL: 'https://nodejs.vamosauditaropresidente.com',
})

export default api;