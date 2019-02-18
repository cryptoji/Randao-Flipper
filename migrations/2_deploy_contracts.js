var EtherFlipper = artifacts.require("./RandaoFlipper.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherFlipper);
};
