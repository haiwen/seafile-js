const { SeafileAPI } = require('../src/seafile-api')

// load config from config.json
var fs = require("fs");
var contents = fs.readFileSync("test/config.json");
var config = JSON.parse(contents);
const repoID = "8342175d-cb2c-457c-adde-66c632c6adc8";
const filePath = "/test.md"
const dirPath = "/"

const seafileAPI = new SeafileAPI();
seafileAPI.init({ server: config.server, username: config.username, password: config.password });

beforeAll(() => {
  return seafileAPI.login();
});

test("authPing", () => {
  return seafileAPI.authPing().then((response) => {
    console.log(response.data);
    expect(response.data).toBe('pong');
  });
});

// test methods in seafile-api.js
test("login",() => {
  return seafileAPI.login().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listRepos",() => {
  return seafileAPI.listRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileInfo",(repoID,filePath) => {
  return seafileAPI.getFileInfo().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileDownloadLink",(repoID,filePaht) => {
  return seafileAPI.getFileDownloadLink().then((response) => {
    var downloadLink = response.data;
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir",(repoID,dirPath) => {
  return seafileAPI.listDir().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir",(repoID, dirPath, opts = { recursive : true } ) =>{ 
  return seafileAPI.listDir().then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
  });
});

test("getUpdateLink",(repoID,folderPath) => {
  return seafileAPI.getUpdateLink().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getUploadLink",(repoID,dirPath) => {
  return seafileAPI.getUploadLink().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getAccountInfo",() =>{
  return seafileAPI.getAccountInfo().then((response) =>{
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listWikiDir",(slug) =>{
  return seafileAPI.listWikiDir().then((response) =>{
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getWikiFileContent",(slug,filePath) =>{
  return seafileAPI.getWikiFileContent().then((response) =>{
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileHistory",() => {
  return seafileAPI.getFileHistory().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getSharedRepos",() => {
  return seafileAPI.getSharedRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getBeSharedRepos",() => {
  return seafileAPI.getBeSharedRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});
// test end