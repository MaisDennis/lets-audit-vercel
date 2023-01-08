import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.132.7.16:3333',
  // baseURL: 'http://localhost:3002',
})

export default api;