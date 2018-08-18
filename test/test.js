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
console.log(filesName);

beforeAll(() => {
  return seafileAPI.login();
});

test("authPing", () => {
  return seafileAPI.authPing().then((response) => {
    console.log(response.data);
    expect(response.data).toBe('pong');
  });
});

test("listRepos", () => {
  return seafileAPI.listRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileInfo", () => {
  return seafileAPI.getFileInfo(repoID, filePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
})

test("getFileDownloadLink", () => {
  return seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
    var downloadLink = response.data;
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir", () => {
  return seafileAPI.listDir(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("listDir", () => {
  return seafileAPI.listDir(repoID, dirPath, true ).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
  });
});

test("getUpdateLink", () => {
  return seafileAPI.getUpdateLink(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getUploadLink", () => {
  return seafileAPI.getUploadLink(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getAccountInfo", () => {
  return seafileAPI.getAccountInfo().then((response) =>{
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileHistory test", () => {
  return seafileAPI.getFileHistory(repoID, filePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getSharedRepos", () => {
  return seafileAPI.getSharedRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getBeSharedRepos", () => {
  return seafileAPI.getBeSharedRepos().then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('createFile test', () => {
  return seafileAPI.createFile(repoID, filePath).then((response) => {
    console.log(response.data);
    expect(response.data).toBe('success');
  });
});


test('renameFile test', () => {
  return seafileAPI.renameFile(repoID, filePath,newfileName).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});


test("deleteFile test", () => {
  return seafileAPI.deleteFile(repoID, filePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('createDirecotry test', () => {
  return seafileAPI.createDir(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("deleteDirectory test", () => {
  return seafileAPI.deleteDir(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).toBe('success');
  });
});

test("copyDirectory test", () => {
  return seafileAPI.copyDir(repoID, dstrepoID, dstfilePath, filesName).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

<<<<<<< Updated upstream
// test end
=======
test('download file resue', () => {
    return seafileAPI.downloadFile(repoID, filePath, 1).then((response) => {
    console.log(response.data);
      expect(response.data).not.toBe(null);
    }) ;
});

test('download file no-reuse', () => {
    return seafileAPI.downloadFile(repoID, filePath).then((response) => {
    console.log(response.data);
      expect(response.data).not.toBe(null);
    }) ;
});

test('getUpdateLink test', () => {
  return seafileAPI.getUpdateLink(repoID, dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('updateFile test', () =>  {
  return seafileAPI.updateFile(repoID, dirPath, parentDir, relaPath, fileData).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('updateFile test has retjson', () =>  {
  return seafileAPI.updateFile(repoID, folderPath, parentDir, relaPath, fileData, 1).then((response) => {
    console.log(reponse.data);
    expect(reponse.data).not.toBe(null);
  });
});

//test share file(no pwd)
test('createShareLink test', () => {
  return seafileAPI.createShareLink(repoID, filePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

//test share file(has pwd)
test('createShareLink test', () => {
  return seafileAPI.createShareLink(repoID, dirPath, password, days).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test('del ShareLink', () => {
  return seafileAPI.deleteShareLink(token).then((response) => {
    expect(response.data).toEqual({"success": true});
  });
});


test('ListAllLink', () => {
    return seafileAPI.ListAllLink().then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

test('ListLibLink', () => {
    return seafileAPI.ListLibLink(repoID).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

// list folder link for file
test('ListFolderLink', () => {
    return seafileAPI.ListFolderLink(repoID, filePath).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

// list folder link for folder(dir)
test('ListFolderLink', () => {
    return seafileAPI.ListFolderLink(repoID, parentDir).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

test('del share link', () => {
    return seafileAPI.deleteShareLink(token).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    }) ;
});

test('ListAllLink', () => {
    return seafileAPI.ListAllLink().then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

test('ListLibLink', () => {
    return seafileAPI.ListLibLink(repoID).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

// test file
test('ListFolderLink', () => {
    return seafileAPI.ListFolderLink(repoID, filePath).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

// test dir(folser)
test('ListFolderLink', () => {
    return seafileAPI.ListFolderLink(repoID, dirPath).then((response) => {
      console.log(response.data);
      expect(response.data).not.toBe(null);
    });
});

// test end
>>>>>>> Stashed changes
