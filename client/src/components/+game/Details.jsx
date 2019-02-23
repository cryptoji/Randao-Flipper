import React from 'react';
import PropTypes from 'prop-types';

const GameDetails = ({ game }) => (
  <div>
    <h1>Game {game.id}</h1>

    <p>
      {game.completed ? <strong className="text-info">Game completed</strong> : ''}
      {game.closed ? <strong className="text-warning">Game closed</strong> : ''}
      {
        (!game.completed && !game.closed) &&
        game.commitCounter < game.config.participantsNumber ?
          <strong className="text-success">Waiting participants</strong> :
          <strong className="text-info">Reveal numbers</strong>
      }
    </p>

    <ul className="list-unstyled lead">
      <li>
        <i className="fa fa-stopwatch"/> Deadline
        {' ' + game.deadline} block
      </li>
      <li>
        <i className="fa fa-users"/> Participants
        {' ' + game.commitCounter} of
        {' ' + game.config.participantsNumber}
      </li>
      <li>
        <i className="fa fa-trophy"/> Winners
        {' ' + game.config.winnersNumber + ' '}
      </li>
      <li><hr/></li>
      <li>
        Deposit
        {' ' + game.deposit + ' '}
        <i className="fab fa-ethereum"/> ETH
      </li>
      <li>
        Total win
        {' ' + (game.deposit * game.config.participantsNumber) + ' '}
        <i className="fab fa-ethereum"/> ETH<br/>
        <small className="text-info">
          {(game.deposit * game.config.participantsNumber) / game.config.winnersNumber + ' '}
          ETH for each winner
        </small>
      </li>
      <li><hr/></li>
      <li>
        <i className="fa fa-sign-in-alt"/> Commits
        {' ' + game.commitCounter}
      </li>
      <li>
        <i className="fa fa-clipboard-check"/> Reveals
        {' ' + game.revealCounter}
      </li>
    </ul>
  </div>
);

GameDetails.propTypes = {
  game: PropTypes.object.isRequired
}

export default GameDetails;