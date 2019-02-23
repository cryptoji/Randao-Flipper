import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  let statusText;
  let actionButton = <Link to={`/game/${game.id}`}><Button color="secondary">View</Button></Link>;

  if (game.completed) {
    statusText = <span className="text-muted">Game completed</span>;
  }
  else if (game.closed) {
    statusText = <span className="text-danger">Game closed</span>;
  }
  else {
    if (game.commitCounter < game.config.participantsNumber) {
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
          <CardTitle>
            <strong>
              Game {game.id}
            </strong>
          </CardTitle>
          <CardSubtitle>
            {statusText}<br/>
            {
              game.ownerInvolved ? (
                <span className="text-info">
                  Owner involved
                  <br/>
                </span>
              ) : ''
            }
          </CardSubtitle>
          <CardText>
            Participants <i className="fa fa-users"/> {game.commitCounter}/{game.config.participantsNumber}<br/>
            Winners <i className="fa fa-trophy"/> {game.config.winnersNumber}<br/>
            Deadline <i className="fa fa-stopwatch"/> {game.deadline} block<br/>
            Total win <i className="fab fa-ethereum"/>
            {' ' + game.deposit * game.config.participantsNumber}<br/>
            Deposit <i className="fab fa-ethereum"/> {game.deposit}<br/>
          </CardText>
          {actionButton}
        </CardBody>
      </Card>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.object.isRequired
};

export default GameCard;