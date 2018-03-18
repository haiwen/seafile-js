const { SeafileAPI } = require('../src/seafile-api')

// load config from config.json
var fs = require("fs");
var contents = fs.readFileSync("config.json");
var config = JSON.parse(contents);
const repoID = "8342175d-cb2c-457c-adde-66c632c6adc8";
const filePath = "/test.md"
const dirPath = "/"

const seafileAPI = new SeafileAPI(config.server, config.username, config.password);
seafileAPI.login().then((response) => {

  seafileAPI.authPing().then((response) => {
    //console.log(response.data);
  });

  seafileAPI.listRepos().then((response) => {
    //console.log(response.data);
  });

  seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
    var downloadLink = response.data;
    seafileAPI.getFileContent(downloadLink);
  });

  seafileAPI.listDir(repoID, dirPath).then((response) => {
    //console.log(response.data);
  });

  seafileAPI.getUpdateLink(repoID, dirPath).then((response) => {
    console.log(response.data);
  });

})
