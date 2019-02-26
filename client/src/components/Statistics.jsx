import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getShortAddress } from '../utils'

const StatisticsComponent = (props) => {
  const {
    contractAddress,
    ownerReward,
    owner,
    gamesCount,
    blockNumber,
    totalWinners,
    totalFund
  } = props;
  return (
    <section className="mb-4">
      <h5>Statistics</h5>
      <ul className="list-unstyled">
        <li>
          <small className="text-muted">
            Current block {blockNumber}
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
            Owner reward {ownerReward}%
          </small>
        </li>
        <li>
          <small className="text-muted">
            Total games {gamesCount}
          </small>
        </li>
        <li>
          <small className="text-muted">
            Total winners {totalWinners}
          </small>
        </li>
        <li>
          <small className="text-muted">
            Total rewarded {totalFund} ETH
          </small>
        </li>
      </ul>
      <hr/>
    </section>
  );
}

StatisticsComponent.propTypes = {
  contractAddress: PropTypes.string,
  blockNumber: PropTypes.number,
  owner: PropTypes.string,
  gamesCount: PropTypes.number,
  ownerReward: PropTypes.string,
  totalWinners: PropTypes.string,
  totalFund: PropTypes.string
};

const mapStateToProps = state => ({
  contractAddress: state.blockchain.contract.options.address,
  blockNumber: state.blockchain.network.blockNumber,
  owner: state.blockchain.owner,
  gamesCount: state.games.data.length,
  ownerReward: state.games.ownerReward,
  totalWinners: state.games.totalWinners,
  totalFund: state.blockchain
    .web3.utils.fromWei(state.games.totalFund, 'ether')
    .substring(0, 6)
});

const Statistics = connect(
  mapStateToProps,
  null
)(StatisticsComponent);

export default Statistics;