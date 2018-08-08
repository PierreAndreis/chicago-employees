import { actionTypes } from "./actions";

export const initialState = {
  page: 1,
  pageSize: 20,
  focusIndex: 0,
  employees: [],

  error: null,
  loading: false,

  filters: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PAGE_START:
      return {
        ...state,
        page: action.page,
        loading: true,
        employees: [],
        error: null
      };

    case actionTypes.LOAD_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload,
        error: null
      };

    case actionTypes.FOCUS_INDEX_SET:
      return {
        ...state,
        focusIndex: action.focusIndex
      };

    case actionTypes.FILTER_ADD:
      const newFilter = new Set([...state.filters]);
      newFilter.add(action.filter);

      return {
        ...state,
        filters: Array.from(newFilter),
        // Focus index to first whenever adding filters
        focusIndex: 0
      };

    case actionTypes.FILTER_REMOVE:
      return {
        ...state,
        filters: state.filters.filter(f => f !== action.filter)
      };

    case actionTypes.FILTER_CLEAR:
      return {
        ...state,
        filters: []
      };

    default:
      return state;
  }
}

export default reducer;
