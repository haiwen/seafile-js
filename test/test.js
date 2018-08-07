const { SeafileAPI } = require('../src/seafile-api')

// load config from config.json
var fs = require("fs");
var contents = fs.readFileSync("test/config.json");
var config = JSON.parse(contents);

// (原始文件参数)
// const repoID = "8342175d-cb2c-457c-adde-66c632c6adc8";
// const filePath = "/test.md";
// const dirPath = "/";

// 远程文档网站测试
const repoID = "a46b8d47-8cf9-4c53-8c93-c37e5cecf946";
const filePath = "/sum.js";
const dirPath = "/";

const newfileName = "add.js";
const desrepoID = 'fd12e063-ac3c-45c3-8f3c-81def61da6a7';
const desfilePath = '/';
const newdirName = "hello-test";

// const srcrepoID,srcparentDir,srcdirentName,dstrepoID,dstparentDir;

// 本地服务器测试
// const repoID = "a46b8d47-8cf9-4c53-8c93-c37e5cecf946";
// const filePath = "/sum.js";
// const dirPath = "/";

const seafileAPI = new SeafileAPI();
seafileAPI.init({ server: config.server, username: config.username, password: config.password });

beforeAll(() => {
  return seafileAPI.login();
});

// 测试通过
test("authPing", () => {
  return seafileAPI.authPing().then((response) => {
    // console.log(response.data);
    expect(response.data).toBe('pong');
  });
});

// 已经在beforeall执行login，不需要测试
// test("login test",() => {
//   return seafileAPI.login().then((response) => {
//     // console.log(response.token);
//     expect(response).toBe(undefined);
//   });
// })

test("listRepos",() => {
  return seafileAPI.listRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

test("getFileInfo",() => {
  return seafileAPI.getFileInfo(repoID,filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
})

// test success
test("getFileDownloadLink",() => {
  return seafileAPI.getFileDownloadLink(repoID,filePath).then((response) => {
    var downloadLink = response.data;
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// test success
test("listDir",() => {
  return seafileAPI.listDir(repoID,dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// test success
test("listDir",() =>{ 
  return seafileAPI.listDir(repoID, dirPath, true ).then((response) => {
      // console.log(response.data);
      expect(response.data).not.toBe(null);
  });
});

// test success
test("getUpdateLink",() => {
  return seafileAPI.getUpdateLink(repoID,dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// test success
test("getUploadLink",() => {
  return seafileAPI.getUploadLink(repoID,dirPath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 测试通过
test("getAccountInfo",() =>{
  return seafileAPI.getAccountInfo().then((response) =>{
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 测试通过
test("getFileHistory test",() => {
  return seafileAPI.getFileHistory(repoID,filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 测试通过
test("getSharedRepos",() => {
  return seafileAPI.getSharedRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 测试通过
test("getBeSharedRepos",() => {
  return seafileAPI.getBeSharedRepos().then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 0807

//test success
test('createFile test',() => {
  return seafileAPI.createFile(repoID,filePath).then((response) => {
    // console.log(response.data.type);
    expect(response.data.type).toBe('file');
  });
});

// error
test('renameFile test',() => {
  return seafileAPI.renameFile(repoID,filePath,newfileName).then((response) => {
    console.log(response.data);
    expext(response.data).not.toBe(null);
  });
});

//test success
test("deleteFile test",() => {
  return seafileAPI.deleteFile(repoID,filePath).then((response) => {
    // console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

//error
test('copyFile test',() => {
  return seafileAPI.copyFile(repoID,filePath,desrepoID,desfilePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.tobe(null);
  });
}); 

test('createDirecotry test',() => {
  return seafileAPI.createDirectory(repoID,dirPath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});
    
test('renameDirectory test',() => {
  return seafileAPI.renameDirectory(repoID,filePath,newdirName).then((response) => {
    console.log(response.data);
    expect(response.data).toBe(null);
    // 函数没有返回值
  });
});

test("deleteDirectory test",() => {
  return seafileAPI.deleteDirectory(repoID,filePath).then((response) => {
    console.log(response.data);
    expect(response.data).not.toBe(null);
  });
});

// 未给定参数，暂时不测
// test("moveDirectory,test",() => {
//   return seafileAPI.moveDirectory(srcrepoID,srcparentDir,srcdirentName,dstrepoID,dstparentDir).then((response) => {
//     console.log(response.data);
//     expect(response.data).not.toBe(null);
//   });
// });

// test end