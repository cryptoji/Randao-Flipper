pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RandaoFlipper.sol";

contract TestRandaoFlipper {

  function testItStoresAValue() public {
    RandaoFlipper randaoFlipper = RandaoFlipper(DeployedAddresses.RandaoFlipper());

//    simpleStorage.set(89);
//
//    uint expected = 89;
//
//    Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
  }

}
