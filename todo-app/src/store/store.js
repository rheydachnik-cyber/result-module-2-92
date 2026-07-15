import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { tasksReducer, filterReducer, uiReducer } from './reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  filter: filterReducer,
  ui: uiReducer,
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
