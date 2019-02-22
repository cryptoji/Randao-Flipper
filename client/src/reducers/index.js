import { combineReducers } from 'redux';
import games from './games';
import events from './events';
import blockchain from './blockchain';
import forms from './forms';

const reducers = combineReducers({
  blockchain,
  events,
  games,
  forms
});

export default reducers;
