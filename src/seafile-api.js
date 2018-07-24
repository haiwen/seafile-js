import cookie from 'react-cookies';
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

class SeafileAPI {

  constructor(server, username, password, token) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;  //none
    this.req = axios;
    this.isIntergrated = true;
  }

  getToken() {
    const url = this.server + '/api2/auth-token/';
    axios.post(url, {
      username: this.username,
      password: this.password
    })
      .then((response) => {
        this.token = response.data;
        return this.token;
      })
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
        this.isIntergrated = false;
        this.req = axios.create({
          baseURL: this.server,
          headers: { 'Authorization': 'Token ' + this.token }
        });
      })
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
    var url = '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    if (recursive) {
      url = url + '&recursive=1';
    }
    return this.req.get(url);
  }

  //---- file api
  getFileInfo(repoID, filePath) {
    const url = '/api2/repos/' + repoID + '/file/detail/?p=' + filePath;
    return this.req.get(url);
  }


  starFile(repoID, filePath) {
    const url = '/api2/starredfiles/';
    let form = new FormData();
    form.append('repo_id', repoID);
    form.append('p', filePath);

    if (this.isIntergrated) {
      return this.req({
        method: "post",
        url: url,
        data: form,
        headers: {
          "X-CSRFToken": cookie.load('csrftoken'),
        },
      });
    } else {
      return this.req({
        method: "post",
        url: url,
        data: form,
      });
    }
  }

  unStarFile(repoID, filePath) {
    const url = "/api2/starredfiles/?repo_id=" + repoID + "&p=" + filePath;
    if (this.isIntergrated) {
      return this.req({
        method: 'delete',
        url: url,
        headers: {
          "X-CSRFToken": cookie.load('csrftoken'),
        },
      });
    } else  {
      return this.req({
        method: 'delete',
        url: url,
      });
    }

  }

  getFileDownloadLink(repoID, filePath) {
    // reuse default to 1 to eliminate cross domain request problem
    //   In browser, the browser will send an option request to server first, the access Token
    //   will become invalid if reuse=0
    const url = '/api2/repos/' + repoID + '/file/?p=' + filePath + '&reuse=1';
    return this.req.get(url);
  }

  getFileContent(downloadLink) {
    return this.req.get(downloadLink);
  }

  getUpdateLink(repoID, folderPath) {
    const url = '/api2/repos/' + repoID + '/update-link/?p=' + folderPath;
    return this.req({
      method: 'get',
      url: url,
    })
  }

  updateFile(uploadLink, filePath, fileName, data) {
    let formData = new FormData();
    formData.append("target_file", filePath);
    formData.append("filename", fileName);
    let blob = new Blob([data], { type: "text/plain"});
    formData.append("file", blob);
    return this.req({
      method: 'post',
      url: uploadLink,
      data: formData,
    });
  }

  uploadImage (uploadLink, formData) {
    return this.req({
      method: "post",
      data: formData,
      url:uploadLink
    });
  }

  getFileHistory(repoID, folderPath) {

    const url = this.server + "/api2/repos/" + repoID + "/file/history/?p=" + folderPath;

    return this.req.get(url);
  }

  getUploadLink(repoID, folderPath) {
    console.log('ploadLink');
    const url = '/api2/repos/' + repoID + '/upload-link/?p=' + folderPath + '&from=web';
    return this.req({
      url: url,
      method:'get',
    });
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

}

export { SeafileAPI };
