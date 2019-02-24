// Action types
export const UPDATE_FORM_FIELD = 'UPDATE_FORM_FIELD';

/*
 * Forms fields update action
 */
export const updateFormField = (formId, event) => {
  return (dispatch, state) => {
    let { value, name, type } = event.target;
    if (type === 'number') { value = parseFloat(value); }
    if (type === 'checkbox') { value = !state().forms[formId][name]; }
    if (name === 'secret') { value = parseInt(value); }

    dispatch({
      type: UPDATE_FORM_FIELD,
      payload: {
        formId,
        value,
        name,
        type
      }
    });
  };
};