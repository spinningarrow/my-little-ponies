// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 2000000,
      network_id: '*'
    },
    live: {
      host: '159.89.204.101',
      port: 8545,
      gas: 1000000,
      network_id: '*'
    }
  }}
