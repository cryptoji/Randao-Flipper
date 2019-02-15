pragma solidity ^0.5.0;

contract TokensFlipper {

  event ContractCreated(address owner);
  event SessionCreated(address creator);
  event TestE(uint randNumber);

  struct GameSession {
    address payable creator;
    uint betAmount;
    uint percentOfWinners;
    uint numberOfParticipants;
    address payable[] participantsList;
    address payable[] winnersList;
    uint index;
    bool isCompleted;
    bool isClosed;

    // Private*
    mapping(address => bool) participants;
  }

  address payable public owner;
  mapping(uint => GameSession) gameSessions;

  uint public numberOfActiveSessions; // active sessions
  uint public numberOfSessions; // total number of sessions
  uint public totalWinsFund; // total number wins fund in wei
  uint public numberOfWinners; // total number of winners

  modifier onlyOwner() {
    require(msg.sender == owner, "Sender douse't owner.");
    _;
  }

  constructor() public {
    owner = msg.sender;
    emit ContractCreated(owner);
  }

  function createSession(
    uint _betAmount,
    uint _percentOfWinners,
    uint _numberOfParticipants
  ) payable external {
    require(_betAmount == msg.value, "Bet amount should be equal to msg.value");
    require(_percentOfWinners > 1 || _percentOfWinners < 100, "Percent of winners it is number from 1 to 100");
    require(_numberOfParticipants >= 2, "The participant cannot single");
    require(_betAmount > 0.01 ether, "Bet amount too low");

    uint sessionID = numberOfSessions++;
    numberOfActiveSessions++;

    gameSessions[sessionID] = GameSession({
      creator: msg.sender, // session owner
      betAmount: _betAmount, // bet amount
      percentOfWinners: _percentOfWinners,
      numberOfParticipants: _numberOfParticipants,
      participantsList: new address payable[](0), // participants array
      winnersList: new address payable[](0), // winners array
      index: sessionID, // session ID
      isCompleted: false, // is completed
      isClosed: false // is closed
    });
    gameSessions[sessionID].participants[msg.sender] = true;
    gameSessions[sessionID].participantsList.push(msg.sender);

    emit SessionCreated(msg.sender);
  }

  function removeSession(uint sessionID) payable external returns (bool success) {
    require(gameSessions[sessionID].index == sessionID, "Session not found");

    GameSession memory session = gameSessions[sessionID];

    require((msg.sender == session.creator || msg.sender == owner), "Access denied");
    require(session.isClosed != true, "This session already closed");

    for(uint i = 0; i < session.participantsList.length; i++) {
      session.participantsList[i].transfer(session.betAmount);
    }

    gameSessions[sessionID].isClosed = true;
    numberOfActiveSessions--;
    return true;
  }

  function completeSession(uint sessionID) internal {
    require(gameSessions[sessionID].index == sessionID);

    GameSession storage session = gameSessions[sessionID];

//    uint winnersNumber = session.numberOfParticipants / session.percentOfWinners;
//    uint totalFund = session.numberOfParticipants * session.betAmount;
//    uint personFund = totalFund / numberOfWinners;

    for(uint i = 0; i < 10; i++) {
      emit TestE(random(session.numberOfParticipants));
//      session.participantsList[randomNumber].transfer(personFund);
//      session.winnersList.push(session.participantsList[0]);
    }

    session.isCompleted = true;
    numberOfActiveSessions--;
  }

  // Join to game session
  function joinSession(uint sessionID) payable external returns (bool success) {
    require(gameSessions[sessionID].index == sessionID, "Session not found");

    GameSession storage session = gameSessions[sessionID];

    require(msg.value == session.betAmount, "Value not equal to bet amount");
    require(session.participants[msg.sender] != true, "You are already joined to this session.");

    if(session.participantsList.length + 1 == session.numberOfParticipants) {
      session.participants[msg.sender] = true;
      session.participantsList.push(msg.sender);

      completeSession(sessionID);
      return true;
    }
    session.participants[msg.sender] = true;
    session.participantsList.push(msg.sender);
    return true;
  }

  function getSession(uint sessionID) view external returns (
    address payable creator,
    uint betAmount,
    uint percentOfWinners,
    uint numberOfParticipants,
    address payable[] memory participants,
    address payable[] memory winners,
    uint index,
    bool isCompleted,
    bool isClosed
  ) {
    require(gameSessions[sessionID].index == sessionID, "Session not found");
    GameSession memory session = gameSessions[sessionID];
    return (
      session.creator,
      session.betAmount,
      session.percentOfWinners,
      session.numberOfParticipants,
      session.participantsList,
      session.winnersList,
      session.index,
      session.isCompleted,
      session.isClosed
    );
  }

  function random(uint max) view internal returns (uint) {
    return uint(keccak256(abi.encodePacked(now, msg.sender))) % max;
  }
}
