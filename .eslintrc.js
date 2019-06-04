module.exports = {
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended"
  ],
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
      "no-console": "off",
      "no-undef": "off",
  },
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true,
        "modules": true
    }
  }
}
