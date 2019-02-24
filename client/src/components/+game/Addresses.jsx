import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem
} from 'reactstrap';

const GameAddressesList = ({ account, addresses, title }) => (
  <div className="mb-3">
    <h5>{title}</h5>
    {
      addresses.length ?
        (
          <ListGroup>
            {
              addresses.map((address, index) => (
                <ListGroupItem
                  active={false}
                  key={index}>
                  <small>{address}</small>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        ) :
        (
          <p className="text-muted">
            There are no addresses yet. Be the first!
          </p>
        )
    }
  </div>
);

GameAddressesList.propTypes = {
  title: PropTypes.string.isRequired,
  addresses: PropTypes.array.isRequired,
  account: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  account: state.blockchain.accounts[0]
});

// const mapDispatchToProps = dispatch => ({});

const GameAddresses = connect(
  mapStateToProps
  //mapDispatchToProps
)(GameAddressesList);

export default GameAddresses;