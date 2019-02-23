import { combineReducers } from 'redux';
import games from './games';
import events from './events';
import blockchain from './blockchain';
import forms from './forms';
import modals from './modals';

const reducers = combineReducers({
  blockchain,
  events,
  games,
  forms,
  modals
});

export default reducers;
