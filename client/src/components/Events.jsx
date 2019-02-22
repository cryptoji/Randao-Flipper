import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchGameCreatedEvent,
  fetchConfigCreatedEvent
} from '../actions/events';

class EventsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    await this.subscribeEvents();
  }

  async subscribeEvents(getPastEvents = true) {
    const { contract, web3 } = this.props;

    const handleEvent = (_event, updateLists = false) => {
      const type = _event.event;
      const data = _event.returnValues;
      const id = _event.id;
      const event = { id, type, data };

      switch (type) {
        case 'GameConfigurationCreated':
          this.handleConfigCreated(event, updateLists);
          break;
        case 'GameCreated':
          this.handleGameCreated(event, updateLists);
          break;
        default:
          return;
      }
    };

    try {
      const currentBlock = await web3.eth.getBlockNumber();

      if (getPastEvents) {
        contract.getPastEvents('allEvents', {
          // Events from last 100 blocks
          fromBlock: currentBlock > 100 ? currentBlock - 99 : 0,
          toBlock: 'latest'
        }).then((events) => {
          events.forEach(e => handleEvent(e));
        });
      }

      contract.events.allEvents()
        .on('data', e => handleEvent(e, true))
        .on('changed', (event) => {
          console.log(event)
        })
        .on('error', console.error);
    } catch (e) {
      console.error(e);
    }
  }

  handleGameCreated(event, updateLists = false) {
    console.log(event)
    this.props.fetchGameCreatedEvent(event);

    if (updateLists) {
      this.props.updateGame(event.data.id);
    }
  }

  handleGameClosed() {

  }

  handleGameCompleted() {

  }

  handleConfigCreated(event, updateLists = false) {
    console.log(event);
    this.props.fetchConfigCreatedEvent(event);

    if (updateLists) {
      this.props.updateConfigs();
    }
  }

  handleCommited() {

  }

  handleRevealed() {

  }

  handleRewarded() {

  }

  render() {
    return (
      <section>
        <h5>Events</h5>
        {
          this.props.events.map((event, index) => (
            <div key={index} className="mb-1">
              <small>{event.type}</small>
              <br/>
              <small className="text-muted">
                {JSON.stringify(event.data)}
              </small>
            </div>
          ))
        }
      </section>
    );
  }
}

EventsList.propTypes = {
  web3: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,

  fetchGameCreatedEvent: PropTypes.func.isRequired,
  fetchConfigCreatedEvent: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
  updateConfigs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  contract: state.blockchain.contract,
  web3: state.blockchain.web3,
  events: [
    ...state.events.games,
    ...state.events.configs
  ]
});

const mapDispatchToProps = dispatch => ({
  fetchGameCreatedEvent: payload => dispatch(fetchGameCreatedEvent(payload)),
  fetchConfigCreatedEvent: payload => dispatch(fetchConfigCreatedEvent(payload))
});

const Events = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsList);

export default Events;
