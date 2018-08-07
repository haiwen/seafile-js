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
    return this;
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

  //创建、重命名、删除、移动 文件或者目录(单个文件目录)

  // 测试通过
  createFile(repoID,filePath){
    const url = this.server + '/api/v2.1/repos/' + repoID + '/file/?p=' + filePath;
    let form = new FormData();
    form.append('operation','create');
    return this.req.post(url,form,{
      headers:form.getHeaders()
    });
  }

  // 新加入参数：newName
  renameFile(repoID,filePath,newfileName){
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath;
    console.log(url);
    let form = new FormData();
    form.append('operation','rename');
    form.append('newname',newfileName);
    console.log(form);
    return this.req.post(url,form,{
      header:form.getHeaders()
    });
  }
  
  // 测试通过
  deleteFile(repoID,filePath){
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath;
    return this.req.delete(url);
  }

  // 参数: repoID filePath des-repo des-dir(后两个参数需要在测试给出来)
  copyFile(repoID,filePath,desrepoID,desfilePath){
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath;
    let form = new FormData();
    form.append('operation','copy');
    form.append('des_repo',desrepoID);
    form.append('des_dir',desfilePath);
    return this.req.post(url,form,{
      header:form.getHeaders()
    });
  }

  // 参数：新文件目录名-未测试
  renameDirectory(repoID,folderPath,newdirName){
    const url = this.server + 'api2/repos/' + repoID + '/dir/?p=' + folderPath;
    let form = new FormData();
    form.append("operation",'rename');
    form.append("newname",newdirName);
    return this.req.post(url,form,{
      header:form.getHeaders()
    });
    // 函数没有返回值
  }

  deleteDirectory(repoID,folderPath){
    const url = this.server + '/api2/repos/' + '/dir/?p=' + folderPath;
    console.log(url);
    return this.req.delete(url);
  }

  // 异步复制/移动文件/目录-未测试
  // 参数：原始数据库ID，原始父目录，原始目录名称，目标数据库ID，目标父目录
  moveDirectory(srcrepoID,srcparentDir,srcdirentName,dstrepoID,dstparentDir){
    const url = this.server + '/api/v2.1/copy-move-task/';
    let form = new FormData();
    form.append('src_repo_id', srcrepoID);
    form.append('src_parent_dir', srcparentDir);
    form.append('src_dirent_name', srcdirentName);
    form.append('des_repo_id', dstrepoID);
    form.append('des_parent_dir', dstparentDir);
    form.append('operation','move');
    form.append('dirent_type','dir');
    return this.req.post(url,form,{
      header:form.getHeaders()
    });
  }

}
export { SeafileAPI };
