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

  _sendPostRequest(url, form) {
    if (form.getHeaders) {
      return this.req.post(url, form, {
        headers:form.getHeaders()
      });
    } else {
      return this.req.post(url, form);
    }
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
    return this.req.get(url);
  }

  //---- repo API

  listRepos() {
    const url = this.server + '/api2/repos/';
    return this.req.get(url);
  }

  //---- folder API

  listDir(repoID, dirPath, opts = {}) {
    const { recursive } = opts;
    var url =  this.server + '/api/v2.1/repos/' + repoID + '/dir/?p=' + dirPath;
    if (recursive) {
      url = url + '&recursive=1';
    }
    return this.req.get(url);
  }

  listWikiDir(slug, dirPath) {
    const url = this.server + '/api/v2.1/wikis/' + slug + '/dir/?p=' + dirPath;
    return this.req.get(url);
  }

  //---- file api
  getInternalLink(repoID, filePath) {
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api/v2.1/smart-link/?repo_id=' + repoID + '&path=' + path + '&is_dir=false';
    return this.req.get(url);
  }

  getWikiFileContent(slug, filePath) {
    const path = encodeURIComponent(filePath);
    const time = new Date().getTime();
    const url = this.server + '/api/v2.1/wikis/' + slug + '/content/' + '?p=' + path + '&_=' + time;
    return this.req.get(url)
  }

  getFileInfo(repoID, filePath) {
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api2/repos/' + repoID + '/file/detail/?p=' + path;
    return this.req.get(url);
  }

  starFile(repoID, filePath) {
    const url = this.server + '/api2/starredfiles/';
    let form = new FormData();
    form.append('repo_id', repoID);
    form.append('p', filePath);
    return this._sendPostRequest(url, form);
  }

  unStarFile(repoID, filePath) {
    const url = this.server + "/api2/starredfiles/?repo_id=" + repoID + "&p=" + filePath;
    return this.req.delete(url);
  }

  getFileDownloadLink(repoID, filePath) {
    // reuse default to 1 to eliminate cross domain request problem
    //   In browser, the browser will send an option request to server first, the access Token
    //   will become invalid if reuse=0
    const path = encodeURIComponent(filePath);
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + path + '&reuse=1';
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

  //----file and dir API
  createDir(repoID, dirPath) {
    const url =  this.server + '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    let form = new FormData();
    form.append('operation', 'mkdir');
    return this._sendPostRequest(url, form);
  }

  createFile(repoID, filePath) {
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath;
    let form = new FormData();
    form.append('operation', 'create');
    return this._sendPostRequest(url, form);
  }

  renameFile(repoID, filePath, newfileName) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/file/?p=' + filePath;
    let form = new FormData();
    form.append('operation', 'rename');
    form.append('newname', newfileName);
    return this._sendPostRequest(url, form);
  }

  deleteFile(repoID, filePath) {
    const url = this.server + '/api2/repos/' + repoID + '/file/?p=' + filePath;
    return this.req.delete(url);
  }

  //function don't have response
  renameDir(repoID, dirPath, newdirName) {
    const url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + dirPath;
    let form = new FormData();
    form.append("operation", 'rename');
    form.append("newname", newdirName);
    return this._sendPostRequest(url, form);
  }

  deleteDir(repoID, dirPath) {
    const url = this.server + '/api2/repos/' +  repoID + '/dir/?p=' + dirPath;
    return this.req.delete(url);
  }

  // copy files or dirs
  copyDir(repoID, dstrepoID, dstfilePath, filesName) {
    const url = this.server + '/api2/repos/' + repoID + '/fileops/copy/';
    let form = new FormData();
    form.append('dst_repo', dstrepoID);
    form.append('dst_dir', dstfilePath);
    form.append('file_names', filesName);
    return this._sendPostRequest(url, form);
  }

  searchFiles(searchParams, cancelToken) {
    const url = this.server + '/api2/search/';
    return this.req.get(url, {params: searchParams, cancelToken : cancelToken});
  }

  getSource() {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    return source;
  }

  //---- ShareLink API
  createShareLink(repoID, path, password, expireDays) {
    const url = this.server + '/api/v2.1/share-links/';
    let form = new FormData();
    form.append('path', path);
    form.append('repo_id', repoID);
    if (password) {
      form.append('password', password);
    }
    if (expireDays) {
      form.append('expire_days', expireDays);
    }
    return this._sendPostRequest(url, form);
  }

  deleteShareLink(token) {
    const url = this.server + '/api/v2.1/share-links/' + token + '/';
    return this.req.delete(url);
  }

  listAllShareLinks() {
    const url = this.server + '/api/v2.1/share-links/';
    return this.req.get(url);
  }

  listRepoShareLinks(repoID) {
    const url = this.server + '/api/v2.1/share-links/?repo_id=' + repoID;
    return this.req.get(url);
  }

  getShareLink(repoID, path) {
    const url = this.server + '/api/v2.1/share-links/?repo_id=' + repoID + '&path=' + path;
    return this.req.get(url);
  }

  //---- Group API
  listGroups() {
    const url = this.server + '/api2/groups/';
    return this.req.get(url);
  }

  // ---- Activities API
  listActivities(pageNum, avatarSize=36) {
    const url = this.server + '/api/v2.1/activities/?page=' + pageNum + '&size=' + avatarSize;
    return this.req.get(url);
  }

  //---- Notification API
  listPopupNotices() {
    const url = this.server + '/ajax/get_popup_notices/';
    return this.req.get(url, { headers: {'X-Requested-With': 'XMLHttpRequest'}});
  }

  updateNotifications() {
    const url = this.server + '/api/v2.1/notifications/';
    return this.req.put(url);
  }

  //--- filehistory api
  listFileHistoryRecords(repoID, path, page, per_page) {
    const url = this.server +  '/api/v2.1/repos/'+ repoID + '/file/new_history/';
    const params = {
      path: path,
      page: page,
      per_page: per_page,
    }
    return this.req.get(url, {params: params});
  }

  getFileRevision(repoID, commitID, filePath) {
    let url = this.server + '/api2/' + 'repos/' + repoID + '/file' + '/revision/?p=' + filePath + '&commit_id=' + commitID
    return this.req.get(url);
  }

  revertFile(repoID, path, commitID) {
    const url = this.server +  '/api/v2.1/repos/'+ repoID + '/file/?p=' + path;
    let form = new FormData();
    form.append("operation", 'revert');
    form.append("commit_id", commitID);
    return this._sendPostRequest(url, form);
  }

  // draft operation api
  listDrafts() {
    const url = this.server + '/api/v2.1/drafts';
    return this.req.get(url);
  }

  deleteDraft(id) {
    const url = this.server + '/api/v2.1/drafts/' + id + '/';
    return this.req.delete(url);
  }

  publishDraft(id) {
    const url = this.server + '/api/v2.1/drafts/' + id + '/';
    const params = {
      operation: 'publish'
    }
    return this.req.put(url, params);
  }

  // file comments api
  postComment(repoID, filePath, comment) {
    const url = this.server +  '/api2/repos/'+ repoID + '/file/comments/?p=' + filePath;
    let form = new FormData();
    form.append("comment", comment);
    return this._sendPostRequest(url, form);
  }

  getCommentsNumber(repoID, dirPath) {
    const url = this.server + '/api2/repos/' + repoID + '/file/comments/counts/?p=' + dirPath;
    return this.req.get(url);
  }

  listComments(repoID, filePath) {
    const url = this.server + '/api2/repos/' + repoID + '/file/comments/?p=' + filePath;
    return this.req.get(url);
  }

  zipDownload(repoID, parent_dir, dirents) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/zip-task/?parent_dir=' + parent_dir + '&dirents=' + dirents;
    return this.req.get(url);
  }

  queryZipProgress(zip_token) {
    const url = this.server  + '/api/v2.1/query-zip-progress/?token=' + zip_token;
    return this.req.get(url);
  }

  cancelZipTask(zip_token) {
    const url = this.server + '/api/v2.1/cancel-zip-task/?token=' + zip_token;
    return this.req.get(url);
  }
  
}
export { SeafileAPI };
