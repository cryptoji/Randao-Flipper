var EtherFlipper = artifacts.require("./EtherFlipper.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherFlipper);
};
