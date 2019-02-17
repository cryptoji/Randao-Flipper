pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract EtherFlipper is Ownable {

  // Game configuration
  struct GameConfiguration {
    uint participantsNumber;
    uint winnersNumber;

    // % который теряют проигравшие

    // After this block users will receive
    // rewards if anybody address will a winner.
    // Deposits of participants who did not
    // reveal, will be divided between winners addresses
    uint duration;
  }

  // Participant structure
  struct GameParticipant {
    bytes32 secret; // secret on each round
    bool revealed;
    bool commited;
  }

  struct GameSession {
    uint id; // Game Id
    uint configId; // Configuration Id

    uint deposit; // Deposit to join
    address owner; // Session owner

    // Random numbers collected
    // from game participants
    // it is f(p1.num...pN.num)
    // for each round
    uint random;

    uint commitCounter;
    uint revealCounter;

    uint deadline;

    // Statuses of session
    bool completed;
    bool closed;

    // Participants data
    address[] participants;
    address[] winners;

    // For internal logic
    mapping(address => GameParticipant) _participants;
  }

  // -------------------
  // Game sessions data
  uint public GameCounter; // Number of games
  GameSession[] public GameSessions; // Games array

  // ---------------------
  // Configurations data
  uint public ConfigurationsCounter;
  GameConfiguration[] public GameConfigurations;

  // ---------------------
  // Utils functions
  function encode(uint256 s, address addr) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(s, addr));
  }

  // ------------------------
  // Create new game session
  // with selected configuration
  event GameCreated(uint indexed id);

  modifier isValidConfiguration(uint configId) {
    require(
      GameConfigurations[configId].participantsNumber > 0,
      "Invalid game configuration Id"
    );
    _;
  }

  function getGame(uint gameId)
    external
    view
    returns (
      uint id,
      uint configId,
      uint deposit,
      address owner,
      uint random,
      uint commitCounter,
      uint revealCounter,
      uint deadline,
      bool completed,
      bool closed,
      address[] memory participants,
      address[] memory winners
    )
  {
    GameSession memory game = GameSessions[gameId];
    return (
      game.id,
      game.configId,
      game.deposit,
      game.owner,
      game.random,
      game.commitCounter,
      game.revealCounter,
      game.deadline,
      game.completed,
      game.closed,
      game.participants,
      game.winners
    );
  }

  function createGame(uint configId, bytes32 secret)
    isValidConfiguration(configId)
    payable
    external
  {
    GameCounter++;

    uint gameId = GameSessions.length++;

    // Create game
    GameSession storage game = GameSessions[gameId];
    GameConfiguration memory configuration = GameConfigurations[configId];

    game.id = gameId;
    game.configId = configId;
    game.deposit = msg.value;
    game.owner = msg.sender;
    game.completed = false;
    game.closed = false;
    game.commitCounter = 1;
    game.revealCounter = 0;
    game.participants = new address[](0);
    game.winners = new address[](0);
    game.random = 0;
    game.deadline = block.number + configuration.duration;

    // Owner will first participant
    game.participants.push(msg.sender);
    game._participants[msg.sender] = GameParticipant(secret, false, true);

    emit GameCreated(game.id);
  }

  // ---------------------------
  // Create game configuration
  event GameConfigurationCreated(uint indexed id);

  function createConfiguration(
    uint _participantsNumber,
    uint _winnersNumber,
    uint _duration
  ) onlyOwner external {
    uint configurationId = GameConfigurations.length++;
    GameConfiguration storage configuration = GameConfigurations[configurationId];

    configuration.participantsNumber = _participantsNumber;
    configuration.winnersNumber = _winnersNumber;
    configuration.duration = _duration;

    ConfigurationsCounter++;
    emit GameConfigurationCreated(configurationId);
  }

  // -------------------------
  // Common clients methods
  event NumberCommited(uint gameId, address participant);

  function commitNumber(uint gameId, bytes32 secret) payable external {
    GameSession storage game = GameSessions[gameId];
    GameConfiguration memory config = GameConfigurations[game.configId];

    require(game.deadline > block.number, "This game was deadlined");
    require(msg.value == game.deposit, "msg.value should equal to game deposit");
    require(game.commitCounter < config.participantsNumber, "All participants are joined");
    require(!game._participants[msg.sender].commited, "You are commited");

    game.participants.push(msg.sender);
    game._participants[msg.sender] = GameParticipant(secret, false, true);
    game.commitCounter++;

    emit NumberCommited(gameId, msg.sender);
  }

  event NumberRevealed(uint gameId);

  function revealNumber(uint gameId, uint number) external {
    GameSession storage game = GameSessions[gameId];
    GameConfiguration memory config = GameConfigurations[game.configId];
    bytes32 secret = game._participants[msg.sender].secret;

    require(game.deadline > block.number, "This game was deadlined");
    require(game.commitCounter == config.participantsNumber, "Not all participants are joined");
    require(game.revealCounter < config.participantsNumber, "All numbers are revealed");
    require(secret == encode(number, msg.sender), "Not valid number");
    require(!game._participants[msg.sender].revealed, "You are revealed your number");

    game.revealCounter++;
    game.random += number;
    game._participants[msg.sender].revealed = true;

    emit NumberRevealed(gameId);
  }

  // --------------------------
  // Complete game method
  // calculates winners by
  // common random number
  event GameCompleted(uint gameId, address[] winners);

  function completeGame(uint gameId) external {
    GameSession storage game = GameSessions[gameId];
    GameConfiguration memory config = GameConfigurations[game.configId];

    require(game.revealCounter > 0, "Nobody didn't reveal number, is impossible to select winners");
    require(
      game.revealCounter == config.participantsNumber || game.deadline < block.number,
      "Not all participants revealed and the game deadline is not now"
    );

    // bytes32 hash = blockhash(block.number - 1);
    // uint salt = uint(hash);
    uint random = game.random % config.participantsNumber;
    bool condition = (random + config.winnersNumber) > game.participants.length;

    while(condition) { random--; }

    game.completed = true;

    for(uint i = 0; i < config.winnersNumber; i++) {
      address winner = game.participants[random + i];
      game.winners.push(winner);
    }

    emit GameCompleted(gameId, game.winners);
  }

  // -----------------------------
  // Close the failed game and makes
  // receive deposits to back are possible
  event GameClosed(uint gameId);

  function closeGame(uint gameId) external {
    GameSession storage game = GameSessions[gameId];

    require(game.closed, "This game already is closed");
    require(game._participants[msg.sender].commited, "You are not game participant");
    require(
      game.deadline < block.number && game.revealCounter == 0,
      "Not all participants revealed and the game deadline is not now"
    );

    game.closed = true;

    emit GameClosed(gameId);
  }

  function sendReward(uint gameId) external {

  }
}
