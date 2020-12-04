
## About

This is JavaScript API for Seafile.

## Usage

Install seafile-js package:

```
npm install seafile-js
```

In your project:

```javascript
const { SeafileAPI } = require('seafile-js')

let server = "xxx",
	username = "xxx",
	password = "xxx";

let seafile = new SeafileAPI();
seafile.init({ server, username, password });

await seafileAPI.login();
let response = await seafileAPI.authPing();
console.log(response.data);
```
