// Action types
export const CREATE_GAME_FORM_UPDATE = 'CREATE_GAME_FORM_UPDATE';
export const CREATE_GAME_OWNER_INVOLVED_UPDATE = 'CREATE_GAME_OWNER_INVOLVED_UPDATE';
export const CREATE_CONFIG_FORM_UPDATE = 'CREATE_CONFIG_FORM_UPDATE';

export const updateCreateGameForm = (payload) => ({
  type: CREATE_GAME_FORM_UPDATE,
  payload
});

export const updateCreateConfigForm = (payload) => ({
  type: CREATE_CONFIG_FORM_UPDATE,
  payload
});

export const updateOwnerInvolved = () => ({
  type: CREATE_GAME_OWNER_INVOLVED_UPDATE
});