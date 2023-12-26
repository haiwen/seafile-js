const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  roots: ["<rootDir>/test/"],
  testMatch: [ "<rootDir>/test/test.js"],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
}
