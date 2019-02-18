pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract RandaoFlipper is Ownable {

  // Game configuration
  struct GameConfiguration {
    uint participantsNumber;
    uint winnersNumber;

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
    bool rewarded;
  }

  struct GameSession {
    uint id; // Game Id
    uint configId; // Configuration Id

    uint deposit; // Deposit to join
    address owner; // Session owner

    // Random numbers collected from game participants
    // it is f(p1.num...pN.num)
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
    mapping(address => bool) _winners;
  }

  // -------------------
  // Game sessions data
  uint public GameCounter; // Number of games
  GameSession[] public GameSessions; // Games.jsx array

  // ---------------------
  // Configurations data
  uint public ConfigurationsCounter;
  GameConfiguration[] public GameConfigurations;

  // ---------------------
  // Utils functions
  function encode(uint256 s, address sender) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(s, sender));
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
    game._participants[msg.sender] = GameParticipant(secret, false, true, false);

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
    game._participants[msg.sender] = GameParticipant(secret, false, true, false);
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

  // -------------------------------
  // Complete game method calculates
  // winners by common random number
  event GameCompleted(uint gameId, address[] winners);

  function completeGame(uint gameId) external {
    GameSession storage game = GameSessions[gameId];
    GameConfiguration memory config = GameConfigurations[game.configId];

    require(!game.completed, "This game is completed");
    require(game.revealCounter > 0, "Nobody didn't reveal number, is impossible to select winners");
    require(
      game.revealCounter == config.participantsNumber || game.deadline < block.number,
      "Not all participants revealed and the game deadline is not now"
    );

    uint random = (game.random + block.number) % config.participantsNumber;

    while((random + config.winnersNumber) > game.participants.length) { random--; }
    while((random - config.winnersNumber / 2 + 1) < 0) { random++; }

    bool takeRight = true;
    uint leftBias = random;
    uint rightBias = random;

    for(uint i = 0; i < config.winnersNumber; i++) {
      if(takeRight) {
        address winner = game.participants[rightBias];
        GameParticipant memory participant = game._participants[winner];

        if(participant.revealed) {
          game._winners[winner] = true;
          game.winners.push(winner);
        }

        rightBias++;
      } else {
        leftBias--;

        address winner = game.participants[leftBias];
        GameParticipant memory participant = game._participants[winner];

        if(participant.revealed) {
          game._winners[winner] = true;
          game.winners.push(winner);
        }
      }
    }

    game.completed = true;

    emit GameCompleted(gameId, game.winners);
  }

  // -----------------------------
  // Close the failed game and makes
  // receive deposits to back are possible
  event GameClosed(uint gameId);

  function closeGame(uint gameId) external {
    GameSession storage game = GameSessions[gameId];

    require(!game.closed, "This game already is closed");
    require(game._participants[msg.sender].commited, "You are not game participant");
    require(
      game.deadline < block.number && game.revealCounter == 0,
      "Not all participants revealed and the game deadline is not now"
    );

    game.closed = true;

    emit GameClosed(gameId);
  }

  // -----------------------------
  // After game is completed
  // users can get their rewards
  event RewardSent(uint gameId, address receiver);

  function getReward(uint gameId) external {
    GameSession storage game = GameSessions[gameId];
    GameParticipant storage participant = game._participants[msg.sender];

    require(game.completed || game.closed, "Game is not completed or closed");
    require(!participant.rewarded, "You are already rewarded");
    require(game._winners[msg.sender], "You address is not in winners");

    // Send reward
    uint rewardValue = (game.deposit * game.participants.length) / game.winners.length;
    require(msg.sender.send(rewardValue), "The contract cannot send tokens to receiver");
    participant.rewarded = true;

    emit RewardSent(gameId, msg.sender);
  }
}