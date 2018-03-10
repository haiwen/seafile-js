var axios = require('axios');

class SeafileAPI {

  constructor(server, username, password, token) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;
  }

  getToken() {
    const api = this.server + '/api2/auth-token/';
    axios.post(api, {
      username: this.username,
      password: this.password
    })
    .then((response) => {
      this.token = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
  * Login to server and create axios instance for future usage
  */
  login() {
    const api = this.server + '/api2/auth-token/';
    return axios.post(api, {
      username: this.username,
      password: this.password
    })
    .then((response) => {
      this.token = response.data.token;
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  authPing() {
    return this.req.get('/api2/auth/ping/');
  }

  //---- repos API

  listRepos() {
    const api = this.server + '/api2/repos/'
    return this.req.get(api)
  }

}

module.exports = { SeafileAPI };
