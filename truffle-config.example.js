const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "..."; // 12 word mnemonic

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777"
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://ropsten.infura.io/v3/{API_KEY}"
      ),
      network_id: '3',
    },
  }
};
