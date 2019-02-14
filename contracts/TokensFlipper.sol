pragma solidity ^0.5.0;

contract TokensFlipper {

  struct GameSession {
    address payable creator;
    uint betAmount;
    uint percentOfWinners;
    uint numberOfParticipants;
    address payable[] participantsList;
    mapping(address => bool) participants;
  }

  address payable owner;
  mapping(uint => GameSession) gameSessions;

  uint public numberOfGameSessions;
  uint public totalWinsFund;
  uint public numberOfWinners;

  constructor() public {
    owner = msg.sender;
  }

  function createSession(
    uint _betAmount,
    uint _percentOfWinners,
    uint _numberOfParticipants
  ) payable public returns (bool success) {
    if(msg.value != _betAmount) { revert(); }

    uint sessionID = numberOfGameSessions++;
    gameSessions[sessionID] = GameSession(
      msg.sender,
      _betAmount,
      _percentOfWinners,
      _numberOfParticipants,
      new address payable[](0)
    );
    gameSessions[sessionID].participants[msg.sender] = true;
    gameSessions[sessionID].participantsList.push(msg.sender);

    return true;
  }

  // Join to game session
  function joinSession(uint sessionID) payable public returns (bool success) {
    GameSession storage session = gameSessions[sessionID];

    if(session.participants[msg.sender] == true) { revert(); }
    require(msg.value == session.betAmount, "Value not equal to bet amount");

    session.participants[msg.sender] = true;
    session.participantsList.push(msg.sender);

    return true;
  }

  function getSession(uint sessionID) view public returns (
    address payable creator,
    uint betAmount,
    uint percentOfWinners,
    uint numberOfParticipants,
    address payable[] memory participants
  ) {
    return (
      gameSessions[sessionID].creator,
      gameSessions[sessionID].betAmount,
      gameSessions[sessionID].percentOfWinners,
      gameSessions[sessionID].numberOfParticipants,
      gameSessions[sessionID].participantsList
    );
  }

  function withdrawAll() payable public returns (bool success) {
    require(msg.sender == owner, "Sender not authorized.");
    owner.transfer(address(this).balance);
    return true;
  }

  function pseudoRandom() private view returns(uint){
    return uint(keccak256(abi.encodePacked(block.difficulty, now, block.timestamp)));
  }
}
