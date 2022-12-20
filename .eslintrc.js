module.exports = {
  "env": {
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": { 
    "sourceType": "module"
  },
  "rules": {
    "strict": 0,
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "off"
  }
}
