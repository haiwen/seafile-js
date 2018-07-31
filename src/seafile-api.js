var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

class SeafileAPI {

  init ({ server, username, password, token }) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token;  //none
    if (this.token && this.server) {
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    }
    return this
  }

  initForSeahubUsage ({ siteRoot, xcsrfHeaders }) {
    if (siteRoot && siteRoot.charAt(siteRoot.length-1) === "/") {
      var server = siteRoot.substring(0, siteRoot.length-1);
      this.server = server;
    } else {
      this.server = siteRoot;
    }

    this.req = axios.create({
      headers: {
        'X-CSRFToken': xcsrfHeaders,
      }
    });
    return this;
  }

  getToken() {
    const url = this.server + '/api2/auth-token/';
    axios.post(url, {
      username: this.username,
      password: this.password
    }).then((response) => {
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
    }).then((response) => {
      this.token = response.data.token;
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token }
      });
    })
  }

  authPing() {
    const url = this.server + '/api2/auth/ping/';
    return this.req.get(url);
  }

  //---- Account API

  getAccountInfo() {
    const url =  this.server + '/api2/account/info/';
    return this.req.get(url)
  }

  //---- repo API

  listRepos() {
    const url = this.server + '/api2/repos/';
    return this.req.get(url);
  }

  //---- folder API

  listDir(repoID, dirPath, opts = {}) {
    const { recursive } = opts;
    var url =  this.server + '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    if (recursive) {
      url = url + '&recursive=1';
    }
    return this.req.get(url);
  }

  listWikiDir(slug) {
    const url = this.server + '/api/v2.1/wikis/' + slug + '/dir/';
    return this.req.get(url);
  }

  //---- file api

  getWikiFileContent(slug, filePath) {
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api/v2.1/wikis/' + slug + '/content/' + '?p=' + filePath;
    return this.req.get(url)
  }

  getFileInfo(repoID, filePath) {
    const url = this.server + '/api2/repos/' + repoID + '/file/detail/?p=' + filePath;
    return this.req.get(url);
  }


  starFile(repoID, filePath) {
    const url = this.server + '/api2/starredfiles/';
    let form = new FormData();
    form.append('repo_id', repoID);
    form.append('p', filePath);
    return this.req.post(url,form)
  }

  unStarFile(repoID, filePath) {
    const url = this.server + "/api2/starredfiles/?repo_id=" + repoID + "&p=" + filePath;
    return this.req.delete(url);
  }

  getFileDownloadLink(repoID, filePath) {
    // reuse default to 1 to eliminate cross domain request problem
    //   In browser, the browser will send an option request to server first, the access Token
    //   will become invalid if reuse=0
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath + '&reuse=1';
    return this.req.get(url);
  }

  getFileContent(downloadLink) {
    return axios.create().get(downloadLink);
  }

  getUpdateLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/update-link/?p=' + folderPath;
    return this.req.get(url)
  }

  updateFile(uploadLink, filePath, fileName, data) {
    let formData = new FormData();
    formData.append("target_file", filePath);
    formData.append("filename", fileName);
    let blob = new Blob([data], { type: "text/plain" });
    formData.append("file", blob);
    return (
      axios.create()({
        method: 'post',
        url: uploadLink,
        data: formData,
      })
    );
  }

  uploadImage (uploadLink, formData) {
    return (
      axios.create()({
        method: "post",
        data: formData,
        url: uploadLink
      })
    );
  }

  getFileHistory(repoID, folderPath) {

    const url = this.server + "/api2/repos/" + repoID + "/file/history/?p=" + folderPath;

    return this.req.get(url);
  }

  getUploadLink(repoID, folderPath) {
    const url = this.server + '/api2/repos/' + repoID + '/upload-link/?p=' + folderPath + '&from=web';
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
    const url =  this.server + '/api2/repos/' + repoID + '/dir/?p=' + folderPath;
    let form = new FormData();
    form.append('operation', 'mkdir');
    return this.req.post(url, form, {
      headers: form.getHeaders()
    });
  }

}

export { SeafileAPI };
