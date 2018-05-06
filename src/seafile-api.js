var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

class SeafileAPI {

  constructor(server, username, password, token) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;
  }

  getToken() {
    const url = this.server + '/api2/auth-token/';
    axios.post(url, {
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
    const url = this.server + '/api2/auth-token/';
    return axios.post(url, {
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

  //---- repo API

  listRepos() {
    const url = this.server + '/api2/repos/';
    return this.req.get(url);
  }

  //---- folder API

  listDir(repoID, dirPath, opts = {}) {
    const { recursive } = opts;
    var url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    if (recursive) {
      url = url + '&recursive=1';
    }
    return this.req.get(url);
  }

  //---- file api
  getFileDownloadLink(repoID, filePath) {
    // reuse default to 1 to eliminate cross domain request problem
    //   In browser, the browser will send an option request to server first, the access Token
    //   will become invalid if reuse=0
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath + '&reuse=1';
    return this.req.get(url);
  }

  getFileContent(downloadLink) {
    return this.req.get(downloadLink);
  }

  getUpdateLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/update-link/?p=' + folderPath;
    return this.req.get(url);
  }

  getUploadLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/upload-link/?p=' + folderPath;
    return this.req.get(url);
  }

  getSharedRepos() {
    const url = this.server + '/api2/shared-repos/';
    return this.req.get(url);
  }

  getBeSharedRepos() {
    const url = this.server + '/api2/beshared-repos/';
    return this.req.get(url);
  }

  createDirectory(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + folderPath;
    let form = new FormData();
    form.append('operation', 'mkdir');
    return this.req.post(url, form, {
      headers: form.getHeaders()
    });
  }

  async uploadFile(repoID, localFileLocation, remoteFilePath) {
    let uploadLink = await this.getUploadLink(repoID, remoteFilePath);
    uploadLink = uploadLink.data;
    let form = new FormData();
    form.append('file', fs.createReadStream(localFileLocation));
    form.append('parent_dir', remoteFilePath);
    return this.req.post(uploadLink, form, {
      headers: form.getHeaders(),
      maxContentLength: 50 * 1024 * 1024 * 8
    });
  }

}

module.exports = { SeafileAPI };
