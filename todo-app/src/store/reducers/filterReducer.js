// src/store/reducers/filterReducer.js
import { FILTER_ACTIONS } from '../../constants';

const initialState = {
  searchText: '',
  sortAlphabetically: false,
};

export const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_ACTIONS.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    case FILTER_ACTIONS.SET_SORT_MODE:
      return {
        ...state,
        sortAlphabetically: action.payload,
      };

    default:
      return state;
  }
};