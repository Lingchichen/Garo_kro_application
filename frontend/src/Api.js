import axios from 'axios';

//Just a convenience wrapper for axios, configured with the given api token.
export default class Api {
  constructor(token = '') {
    this.token = token;
    this.axios = null;
    this.configureAxios();
  }

  configureAxios() {
    if (this.token) {
      this.axios = axios.create({
        baseURL: '/api/v1/',
        headers: { Authorization: 'Token ' + this.token }
      });
    } else {
      this.axios = axios.create({
        baseURL: '/api/v1/'
      });
    }
  }

  get(endpoint, id = null) {
    if (id) return this.axios.get(endpoint + '/' + id + '/');
    else return this.axios.get(endpoint + '/');
  }

  post(endpoint, data) {
    return this.axios.post(endpoint + '/', data);
  }

  put(endpoint, id, data) {
    return this.axios.put(endpoint + '/' + id + '/', data);
  }

  delete(endpoint, id, data=null) {
    if(!data) return this.axios.delete(endpoint + '/' + id + '/');
    return this.axios(endpoint + '/' + id + '/', {
      method: 'delete',
      data
    });
  }

  checkLoggedIn() {
    return this.axios.get('');
  }

  setToken(token) {
    this.token = token;
    this.configureAxios();
  }
}
