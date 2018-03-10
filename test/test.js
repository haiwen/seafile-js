const { SeafileAPI } = require('../src/seafile-api')

const server = 'https://download.seafile.top'

const seafileAPI = new SeafileAPI(server, 'XXX', 'XXX');
seafileAPI.login().then((response) => {
  seafileAPI.authPing().then((response) => {
    console.log(response.data);
  });
  seafileAPI.listRepos().then((response) => {
    console.log(response.data);
  });
})
