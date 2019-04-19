const { SeafileAPI } = require('../src/seafile-api')

// load config from config.json
var fs = require("fs");
var contents = fs.readFileSync("test/config.json");
var config = JSON.parse(contents);

const seafileAPI = new SeafileAPI();
seafileAPI.init({ server: config.server, username: config.username, password: config.password });

const repoID = config.repoID;
const filePath = config.filePath;
const fileName = config.fileName;
const dirPath = config.dirPath;
const newfileName = config.newfileName;
const dstrepoID = config.dstrepoID;
const dstfilePath = config.dstfilePath;
const newdirName = config.newdirName;
const filesName = config.filesName;
const comment = config.comment;
const detail = config.detail;
const reviewID = config.reviewID;
console.log(filesName);

beforeAll(() => {
  return seafileAPI.login();
});

test("authPing", () => {
  return seafileAPI.authPing().then((response) => {
    // console.log(response.data);
    expect(response.data).toBe('pong');
  });
});

test("listRepos", () => {
  return seafileAPI.listRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileInfo", () => {
  return seafileAPI.getFileInfo(repoID, filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
})

test("getFileDownloadLink", () => {
  return seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
    var downloadLink = response.data;
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir", () => {
  return seafileAPI.listDir(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir", () => {
  return seafileAPI.listDir(repoID, dirPath, true ).then((response) => {
      // console.log(response.data);
      expect(response.data).not.toBe(null);
  });
});

test("getUpdateLink", () => {
  return seafileAPI.getUpdateLink(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getUploadLink", () => {
  return seafileAPI.getUploadLink(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getAccountInfo", () => {
  return seafileAPI.getAccountInfo().then((response) =>{
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileHistory test", () => {
  return seafileAPI.getFileHistory(repoID, filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getSharedRepos", () => {
  return seafileAPI.getSharedRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getBeSharedRepos", () => {
  return seafileAPI.getBeSharedRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('createFile test', () => {
  return seafileAPI.createFile(repoID, filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).toBe('success');
  });
});


test('renameFile test', () => {
  return seafileAPI.renameFile(repoID, filePath,newfileName).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});


test("deleteFile test", () => {
  return seafileAPI.deleteFile(repoID, filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('createDirecotry test', () => {
  return seafileAPI.createDir(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("deleteDirectory test", () => {
  return seafileAPI.deleteDir(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).toBe('success');
  });
});

test("copyDirectory test", () => {
  return seafileAPI.copyDir(repoID, dstrepoID, dstfilePath, filesName).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("postComment test", () => {
  return seafileAPI.postComment(repoID, filePath, comment).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getCommentsNumber test", () => {
  return seafileAPI.getCommentsNumber(repoID, dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listComments test", () => {
  return seafileAPI.listComments(repoID, filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("updateComment test", () => {
  return seafileAPI.updateComment(repoID, 57, 'true', comment).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getUserAvatar test", () => {
  return seafileAPI.getUserAvatar(config.username, 40).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("invitePeople test", () => {
  return seafileAPI.invitePeople(config.inviteEmails).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listInvitations test", () => {
  return seafileAPI.listInvitations().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("deleteInvitation test", () => {
  return seafileAPI.deleteInvitation(config.invitationToken).then((response) => {
    // console.log(response.status);
    expect(response.status).toBe(204);
  });
});

// test end
