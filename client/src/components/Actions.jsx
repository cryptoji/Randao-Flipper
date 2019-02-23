import React from 'react';
import { connect } from 'react-redux';
import {
  Nav,
  NavItem,
  NavLink,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import PropTypes from 'prop-types'
import {
  updateCreateGameForm,
  updateCreateConfigForm,
  updateOwnerInvolved
} from '../actions/forms';
import { fetchBalance } from '../actions/blockchain';

export function getConfigTitle(config) {
  const participants = `${config.participantsNumber} participants`;
  const winners = `${config.winnersNumber} winners`;
  const duration = `${config.duration} blocks duration`;
  return `${participants} / ${winners} / ${duration}`;
}

class ActionsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameModal: false,
      configModal: false
    };
  }

  toggleGameModal = () => {
    this.setState(prevState => ({
      gameModal: !prevState.gameModal
    }));
  };

  toggleConfigModal = () => {
    this.setState(prevState => ({
      configModal: !prevState.configModal
    }));
  };

  handleCreateGame = async(event) => {
    event.preventDefault();

    const { web3, account, contract } = this.props;
    let { configId, secret, deposit, ownerInvolved } = this.props.createGameForm;

    secret = await contract.methods.encode(secret, account).call();
    deposit = web3.utils.toHex(web3.utils.toWei(web3.utils.toBN(deposit), 'ether'));

    try {
      await contract.methods
        .createGame(configId, secret, deposit, ownerInvolved)
        .send({
          from: account,
          // value: deposit
        });
    } catch (e) {
      console.error(e);
    }

    this.toggleGameModal();
    await this.props.fetchBalance();
  };

  handleCreateConfig = async(event) => {
    event.preventDefault();

    const { account, contract } = this.props;
    const { participants, winners, deadline } = this.props.createConfigForm;

    try {
      await contract.methods
        .createConfiguration(participants, winners, deadline)
        .send({ from: account });
    } catch (e) {
      console.error(e);
    }

    this.toggleConfigModal();
    await this.props.fetchBalance();
  };

  handleOwnerInvolved = () => {
    this.props.updateOwnerInvolved();
  };

  handleGameFieldChange = (event) => {
    let { value, name, type } = event.target;
    if (type === 'number') { value = parseInt(value); }
    this.props.updateGameForm({ field: name, value, type });
  };

  handleConfigFieldChange = (event) => {
    let { value, name, type } = event.target;
    if (type === 'number') { value = parseInt(value); }
    this.props.updateConfigForm({ field: name, value, type });
  };

  render() {
    return (
      <section className="mb-3">
        <Nav tabs>
          <NavItem>
            {
              this.props.gameConfigs.length ?
                <NavLink
                  active={this.state.gameModal}
                  onClick={this.toggleGameModal}>
                  Create game
                </NavLink>
                : ''
            }
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.configModal}
              onClick={this.toggleConfigModal}>
              Create config
            </NavLink>
          </NavItem>
        </Nav>

        <Modal
          isOpen={this.state.gameModal}
          toggle={this.toggleGameModal}>
          <ModalHeader toggle={this.toggleGameModal}>
            Create new game
          </ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="gameConfig">Configuration</Label>
                <Input
                  type="select"
                  name="configId"
                  id="gameConfig"
                  placeholder="Number of participants"
                  value={this.props.createGameForm.configId}
                  onChange={this.handleGameFieldChange}>
                  <option disabled>Select game configuration</option>
                  {
                    this.props.gameConfigs.map((config, index) => (
                      <option key={index} value={index}>
                        {getConfigTitle(config)}
                      </option>
                    ))
                  }
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="depositValue">Deposit</Label>
                <Input
                  type="number"
                  name="deposit"
                  id="depositValue"
                  placeholder="Set a deposit"
                  value={this.props.createGameForm.deposit}
                  onChange={this.handleGameFieldChange}/>
              </FormGroup>

              {
                this.props.createGameForm.ownerInvolved ?
                  <FormGroup>
                    <Label for="gameSecret">Secret</Label>
                    <Input
                      type="number"
                      name="secret"
                      id="gameSecret"
                      placeholder="Set a secret number"
                      value={this.props.createGameForm.secret}
                      onChange={this.handleGameFieldChange}/>
                  </FormGroup> : ''
              }

              <FormGroup check>
                <Label for="ownerInvolved" check>
                  <Input
                    type="checkbox"
                    name="ownerInvolved"
                    id="ownerInvolved"
                    placeholder="Set a deposit"
                    checked={this.props.createGameForm.ownerInvolved}
                    onChange={this.handleOwnerInvolved}/>{' '}
                  Owner involved
                </Label>
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              color="success"
              onClick={this.handleCreateGame}>
              Create game
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.configModal}
          toggle={this.toggleConfigModal}>
          <ModalHeader toggle={this.toggleConfigModal}>
            Create game config
          </ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="participantsNumber">Participants</Label>
                <Input
                  type="number"
                  name="participants"
                  id="participantsNumber"
                  placeholder="Number of participants"
                  value={this.props.createConfigForm.participants}
                  onChange={this.handleConfigFieldChange}/>
              </FormGroup>

              <FormGroup>
                <Label for="winnersNumber">Winners</Label>
                <Input
                  type="number"
                  name="winners"
                  id="winnersNumber"
                  placeholder="Number of winners"
                  value={this.props.createConfigForm.winners}
                  onChange={this.handleConfigFieldChange}/>
              </FormGroup>

              <FormGroup>
                <Label for="deadline">Deadline</Label>
                <Input
                  type="number"
                  name="deadline"
                  id="deadline"
                  placeholder="Set a deadline"
                  value={this.props.createConfigForm.deadline}
                  onChange={this.handleConfigFieldChange}/>
                <FormText color="muted">
                  Set deadline in blocks after the game started.
                </FormText>
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              color="success"
              onClick={this.handleCreateConfig}>
              Create config
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    );
  }
}

ActionsContainer.propTypes = {
  // Props
  fetchBalance: PropTypes.func.isRequired,

  web3: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  gameConfigs: PropTypes.array.isRequired,
  createGameForm: PropTypes.object.isRequired,
  createConfigForm: PropTypes.object.isRequired,
  // Handlers
  updateGameForm: PropTypes.func.isRequired,
  updateConfigForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  web3: state.blockchain.web3,
  contract: state.blockchain.contract,
  account: state.blockchain.accounts[0],
  gameConfigs: state.games.configs,
  createGameForm: state.forms.createGame,
  createConfigForm: state.forms.createConfig
});

const mapDispatchToProps = dispatch => ({
  fetchBalance: () => dispatch(fetchBalance()),
  updateGameForm: payload => dispatch(updateCreateGameForm(payload)),
  updateConfigForm: payload => dispatch(updateCreateConfigForm(payload)),
  updateOwnerInvolved: () => dispatch(updateOwnerInvolved())
});

const Actions = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsContainer);

export default Actions;
