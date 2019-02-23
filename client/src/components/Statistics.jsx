import React from 'react';
import { connect } from 'react-redux';
import { getShortAddress } from '../utils'

const StatisticsComponent = ({ contractAddress, owner, gamesCount }) => (
  <section className="mb-4">
    <h5>Statistics</h5>
    <ul className="list-unstyled">
      <li>
        <small className="text-muted">
          Current block 2141
        </small>
        <hr/>
      </li>
      <li>
        <small className="text-muted">
          Contract
        </small>{' '}
        <small className="text-primary">
          {getShortAddress(contractAddress)}
        </small>
      </li>
      <li>
        <small className="text-muted">
          Owner
        </small>{' '}
        <small className="text-primary">
          {getShortAddress(owner)}
        </small>
      </li>
      <li>
        <small className="text-muted">
          Owner reward 3%
        </small>
      </li>
      <li>
        <small className="text-muted">
          Total games {gamesCount}
        </small>
      </li>
      <li>
        <small className="text-muted">
          Total winners N/a
        </small>
      </li>
      <li>
        <small className="text-muted">
          Total fund N/a ETH
        </small>
      </li>
    </ul>
    <hr/>
  </section>
);

const mapStateToProps = state => ({
  contractAddress: state.blockchain.contract.options.address,
  owner: state.blockchain.owner,
  gamesCount: state.games.data.length
});

const Statistics = connect(
  mapStateToProps,
  null
)(StatisticsComponent);

export default Statistics;