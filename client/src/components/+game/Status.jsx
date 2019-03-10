import React from 'react';
import PropTypes from 'prop-types';

const GameStatus = (props) => {
  const blockNumber = props.blockNumber;
  const {
    closed,
    completed,
    deadline,
    config,
    commitCounter,
    revealCounter
  } = props.game;

  return (
    <p>
      {
        // Check, is completed game?
        completed && (blockNumber > deadline) ? (
          <strong className="text-muted">Game completed</strong>
        ) : ''
      }
      {
        // Check, is closed game?
        closed && (blockNumber > deadline) ? (
          <strong className="text-muted">Game closed</strong>
        ) : ''
      }
      {
        // Check, is out game?
        (!completed && !closed) && (blockNumber > deadline) ? (
            <strong className="text-success">The game is out</strong>
        ) : ''
      }
      {
        // Check, is waiting participants?
        (!completed && !closed) && (blockNumber < deadline) &&
        (commitCounter < config.participantsNumber) ? (
          <strong className="text-success">Waiting participants</strong>
        ) : ''
      }
      {
        // Check, are numbers revealing?
        (!completed && !closed) && (blockNumber < deadline) &&
        (commitCounter === config.participantsNumber) &&
        (revealCounter < config.participantsNumber) ? (
          <strong className="text-info">Reveal numbers</strong>
        ) : ''
      }
    </p>
  );
}

GameStatus.propTypes = {
  game: PropTypes.object.isRequired,
  blockNumber: PropTypes.number.isRequired
};

export default GameStatus;