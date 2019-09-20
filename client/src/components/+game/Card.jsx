import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardSubtitle,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';

const GameCardComponent = ({ game, blockNumber }) => {
  let statusText;
  let actionButton = <Link to={`/game/${game.id}`}><Button color="secondary">View</Button></Link>;

  if (game.completed || blockNumber > game.deadline) {
    statusText = <span className="text-muted">Game completed</span>;
  }
  else if (game.closed || blockNumber > game.deadline) {
    statusText = <span className="text-muted">Game closed</span>;
  }
  else {
    if (parseInt(game.commitCounter) < parseInt(game.config.participantsNumber)) {
      statusText = <span className="text-success">Waiting participants</span>;
      actionButton = <Link to={`/game/${game.id}`}><Button color="success">Play</Button></Link>;
    } else {
      statusText = <span className="text-info">Reveal numbers</span>;
    }
  }

  return (
    <div className="mb-4">
      <Card>
        <CardBody>
          <header>
            <h3>Game {game.id}</h3>
          </header>

          <CardSubtitle>
            <strong>{statusText}</strong>
            <p>
              {game.ownerInvolved ? (
                <span className="text-info">Owner involved</span>
              ) : ''}
            </p>
          </CardSubtitle>

          <ul className="list-unstyled">
            <li>
              Participants <i className="fa fa-users"/> {game.commitCounter}/{game.config.participantsNumber}
            </li>
            <li>
              Winners <i className="fa fa-trophy"/> {game.config.winnersNumber}
            </li>
            <li>
              Deposit <i className="fab fa-ethereum"/> {game.deposit}
            </li>
            <li>
              Total win <i className="fab fa-ethereum"/>
              {' ' + (
                (game.deposit * game.config.participantsNumber) -
                (game.deposit * game.config.winnersNumber)
              ).toFixed(2)}
            </li>
            <li>
              Deadline <i className="fa fa-stopwatch"/>
              {' ' + (game.deadline - blockNumber) + ' blocks'}
            </li>
          </ul>

          {actionButton}
        </CardBody>
      </Card>
    </div>
  );
};

GameCardComponent.propTypes = {
  game: PropTypes.object.isRequired,
  blockNumber: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  blockNumber: state.blockchain.network.blockNumber
});

const GameCard = connect(
  mapStateToProps, null
)(GameCardComponent);

export default GameCard;
