import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { getConfigTitle } from '../Menu'
import {
  handleGameFieldChange,
  handleCreateGame,
  updateOwnerInvolved
} from '../../actions/forms'
import { toggleModal } from '../../actions/modals'

const CreateGame = (props) => {
  const {
    isOpen,
    gameConfigs,
    toggleModal,
    form,
    handleOwnerInvolved,
    handleFieldChange,
    handleCreate
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      toggle={(_) => toggleModal('createGame')}>
      <ModalHeader toggle={(_) => toggleModal('createGame')}>
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
              value={form.configId}
              onChange={handleFieldChange}>
              <option disabled>Select game configuration</option>
              {
                gameConfigs.map((config, index) => (
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
              value={form.deposit}
              onChange={handleFieldChange}/>
          </FormGroup>

          {
            form.ownerInvolved ?
              <FormGroup>
                <Label for="gameSecret">Secret</Label>
                <Input
                  type="number"
                  name="secret"
                  id="gameSecret"
                  placeholder="Set a secret number"
                  value={form.secret}
                  onChange={handleFieldChange}/>
              </FormGroup> : ''
          }

          <FormGroup check>
            <Label for="ownerInvolved" check>
              <Input
                type="checkbox"
                name="ownerInvolved"
                id="ownerInvolved"
                placeholder="Set a deposit"
                checked={form.ownerInvolved}
                onChange={handleOwnerInvolved}/>{' '}
              Owner involved
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button
          color="success"
          onClick={handleCreate}>
          Create game
        </Button>
      </ModalFooter>
    </Modal>
  );
}

CreateGame.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  gameConfigs: PropTypes.array.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleOwnerInvolved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isOpen: state.modals.createGame.isOpen,
  form: state.forms.createGame,
  gameConfigs: state.games.configs
});

const mapDispatchToProps = dispatch => ({
  toggleModal: modalId => dispatch(toggleModal(modalId)),
  handleFieldChange: event => dispatch(handleGameFieldChange(event)),
  handleCreate: () => dispatch(handleCreateGame()),
  handleOwnerInvolved: () => dispatch(updateOwnerInvolved())
});

const CreateGameModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGame);

export default CreateGameModal;