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
  FormText,
  Label,
  Input,
  Button
} from 'reactstrap';
import { toggleModal } from '../../actions/modals';
import {
  handleConfigFieldChange,
  handleCreateConfig
} from '../../actions/forms';

const CreateConfig = (props) => {
  const {
    isOpen,
    toggleModal,
    form,
    handleFieldChange,
    handleCreate
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      toggle={(_) => toggleModal('createConfig')}>
      <ModalHeader toggle={(_) => toggleModal('createConfig')}>
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
              value={form.participants}
              onChange={handleFieldChange}/>
          </FormGroup>

          <FormGroup>
            <Label for="winnersNumber">Winners</Label>
            <Input
              type="number"
              name="winners"
              id="winnersNumber"
              placeholder="Number of winners"
              value={form.winners}
              onChange={handleFieldChange}/>
          </FormGroup>

          <FormGroup>
            <Label for="deadline">Deadline</Label>
            <Input
              type="number"
              name="deadline"
              id="deadline"
              placeholder="Set a deadline"
              value={form.deadline}
              onChange={handleFieldChange}/>
            <FormText color="muted">
              Set deadline in blocks after the game started.
            </FormText>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button
          color="success"
          onClick={handleCreate}>
          Create config
        </Button>
      </ModalFooter>
    </Modal>
  );
}

CreateConfig.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isOpen: state.modals.createConfig.isOpen,
  form: state.forms.createConfig
});

const mapDispatchToProps = dispatch => ({
  toggleModal: modalId => dispatch(toggleModal(modalId)),
  handleFieldChange: event => dispatch(handleConfigFieldChange(event)),
  handleCreate: () => dispatch(handleCreateConfig())
});

const CreateConfigModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateConfig);

export default CreateConfigModal;