
## About

This is JavaScript API for Seafile.

## Usage

Install seafile-js package:

```bash
npm install seafile-js
```

In your project:

```js
const { SeafileAPI } = require('seafile-js')

const server = 'xxx'
const username = 'xxx'
const password = 'xxx'
const seafileAPI = new SeafileAPI()

seafileAPI.init({ server, username, password })

seafileAPI.login().then((response) => {
	seafileAPI.authPing().then((response) => {
		console.log(response)
	}).catch((err) => {
		console.log('error', err);
	})
})
.catch((err) => {
	console.log('error',err.config)
})
```
