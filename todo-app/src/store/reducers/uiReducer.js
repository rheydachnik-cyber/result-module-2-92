// src/store/reducers/uiReducer.js
import { UI_ACTIONS } from '../../constants';

const initialState = {
  loading: false,
  error: null,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case UI_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case UI_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};