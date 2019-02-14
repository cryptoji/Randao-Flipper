var TokensFlipper = artifacts.require("./TokensFlipper.sol");

module.exports = function(deployer) {
  deployer.deploy(TokensFlipper);
};
