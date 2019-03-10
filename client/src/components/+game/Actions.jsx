import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Form,
  Label,
  Input,
  Button
} from 'reactstrap';
import { updateFormField } from '../../actions/forms';
import {
  commitNumber,
  revealNumber,
  completeGame,
  getReward
} from '../../actions/games';
import GameStatus from './Status';

const GameActionsComponent = (props) => {
  const {
    game,
    account,
    commitNumber,
    revealNumber,
    commitForm,
    revealForm,
    completeGame,
    getReward,
    handleCommitFieldChange,
    handleRevealFieldChange,
    blockNumber
  } = props;

  // Participant info
  const { commited, revealed, rewarded } = game.accountData;

  // Game statistics
  const commitsCounter = parseInt(game.commitCounter);
  const revealsCounter = parseInt(game.revealCounter);
  const participantsCounter = parseInt(game.config.participantsNumber);

  // Game permissions
  const canCommit = commitsCounter < participantsCounter;
  const canReveal = (revealsCounter < participantsCounter) && !canCommit;

  // Can complete validator
  const canCompleteGame = (
    (!game.closed && !game.completed) || blockNumber < game.deadline
  ) && (!canCommit && !canReveal && commited && revealed);

  const addressIsWinner = game.winners.find(winner => winner === account);
  const statusEl = (
    <GameStatus
      blockNumber={blockNumber}
      game={game}/>
  );

  if (game.completed) {
    if (rewarded) {
      return (
        <div>
          <p className="text-success">
            The game is completed and your address in winners.{' '}
            You are got reward, good luck in another game session.
          </p>
        </div>
      );
    }

    return addressIsWinner ?
      (
        <div>
          <p className="text-success">
            The game is completed and your address in winners.{' '}
            You can get back your deposit plus reward.
          </p>
          <Button
            color="success"
            onClick={(_) => getReward(game.id)}>
            Get my reward
          </Button>
        </div>
      ) :
      (
        <div>
          <p className="text-muted">
            The game is completed. But you don't win.{' '}
            Try your luck in another game session!
          </p>
        </div>
      );
  }

  if (game.closed) {
    return (
      <div>
        <p className="text-danger">
          The game is closed. You can get back your deposit.
        </p>
      </div>
    );
  }

  return (
    <div>
      {statusEl}

      {
        canCommit && !commited ?
          <p className="text-success">
            Commit secret and waiting other participants...
          </p> : ''
      }

      {
        canReveal && !canCommit ?
          <p className="text-success">
            Reveal your number and waiting other participants...
          </p> : ''
      }

      <div>
        <Form>
          {
            canCommit && !commited ?
              <FormGroup>
                <Label>Commit number</Label>
                <InputGroup>
                  <Input
                    type="number"
                    name="secret"
                    id="secretNumber"
                    placeholder="Your secret number"
                    value={commitForm.secret}
                    onChange={handleCommitFieldChange}/>
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      disabled={!commitForm.secret}
                      onClick={(event) => {
                        event.preventDefault();
                        commitNumber(game);
                      }}>
                      Commit
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup> : ''
          }
          {
            canReveal && !revealed ?
              <FormGroup>
                <Label>Reveal number</Label>
                <InputGroup>
                  <Input
                    type="number"
                    name="number"
                    id="revealNumber"
                    placeholder="Reveal your number"
                    value={revealForm.number}
                    onChange={handleRevealFieldChange}/>
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      disabled={!revealForm.number}
                      onClick={(event) => {
                        event.preventDefault();
                        revealNumber(game.id);
                      }}>
                      Reveal
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup> : ''
          }
          {
            canCompleteGame && !canReveal ?
              (
                <Button
                  color="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    completeGame(game.id);
                  }}>
                  Complete the game
                </Button>
              ): ''
          }
        </Form>
      </div>
    </div>
  );
}

GameActionsComponent.propTypes = {
  blockNumber: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  commitForm: PropTypes.object.isRequired,
  revealForm: PropTypes.object.isRequired,
  handleCommitFieldChange: PropTypes.func.isRequired,
  handleRevealFieldChange: PropTypes.func.isRequired,
  commitNumber: PropTypes.func.isRequired,
  revealNumber: PropTypes.func.isRequired,
  completeGame: PropTypes.func.isRequired,
  getReward: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  blockNumber: state.blockchain.network.blockNumber,
  account: state.blockchain.accounts[0],
  commitForm: state.forms.commitNumber,
  revealForm: state.forms.revealNumber,
  accountGamesData: state.games.accountGamesData
});

const mapDispatchToProps = dispatch => ({
  handleCommitFieldChange: event => dispatch(updateFormField('commitNumber', event)),
  handleRevealFieldChange: event => dispatch(updateFormField('revealNumber', event)),
  commitNumber: game => dispatch(commitNumber(game)),
  revealNumber: gameId => dispatch(revealNumber(gameId)),
  completeGame: gameId => dispatch(completeGame(gameId)),
  getReward: gameId => dispatch(getReward(gameId))
});

const GameActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameActionsComponent);

export default GameActions;