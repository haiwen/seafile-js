
## About

This is JavaScript API for Seafile.

## Usage

Install seafile-js package:

```
npm install seafile-js
```

In your project:

```
const { SeafileAPI } = require('seafile-js')

server = "xxx"
username = "xxx"
password = "xxx"
const seafileAPI = new SeafileAPI(server, username, password;

seafileAPI.login().then((response) => {
	seafileAPI.authPing().then((response) => {
		console.log(response.data);
	});
})
```
