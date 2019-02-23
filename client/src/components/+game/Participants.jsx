import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem
} from 'reactstrap';

const GameParticipantsList = ({ account, participants }) => (
  <div>
    <h5>Participants</h5>
    {
      participants.length ?
        (
          <ListGroup>
            {
              participants.map((address, index) => (
                <ListGroupItem
                  active={account === address}
                  key={index}>
                  <small>{address}</small>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        ) :
        (
          <p className="text-muted">
            There are no participants yet. Be the first!
          </p>
        )
    }
  </div>
);

GameParticipantsList.propTypes = {
  participants: PropTypes.array.isRequired,
  account: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  account: state.blockchain.accounts[0]
});

// const mapDispatchToProps = dispatch => ({});

const GameParticipants = connect(
  mapStateToProps
  //mapDispatchToProps
)(GameParticipantsList);

export default GameParticipants;