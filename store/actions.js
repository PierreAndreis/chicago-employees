export const actionTypes = {
  LOAD_PAGE: "LOAD_PAGE",
  LOAD_PAGE_START: "LOAD_PAGE_START", // @saga only
  LOAD_PAGE_SUCCESS: "LOAD_PAGE_SUCCESS", // @saga only
  LOAD_PAGE_FAILURE: "LOAD_PAGE_FAILURE", // @saga only

  FOCUS_INDEX_NEXT: "FOCUS_INDEX_NEXT",
  FOCUS_INDEX_PREV: "FOCUS_INDEX_PREV",
  FOCUS_INDEX_SET: "FOCUS_INDEX_SET",

  FILTER_ADD: "FILTER_ADD",
  FILTER_REMOVE: "FILTER_REMOVE",
  FILTER_CLEAR: "FILTER_CLEAR"
};

export function addFilter(filter) {
  return {
    type: actionTypes.FILTER_ADD,
    filter
  };
}

export function removeFilter(filter) {
  return {
    type: actionTypes.FILTER_REMOVE,
    filter
  };
}

export function clearFilters() {
  return {
    type: actionTypes.FILTER_CLEAR
  };
}

export function nextFocusIndex() {
  return {
    type: actionTypes.FOCUS_INDEX_NEXT
  };
}

export function prevFocusIndex() {
  return {
    type: actionTypes.FOCUS_INDEX_PREV
  };
}

export function setFocusIndex(focusIndex) {
  return {
    type: actionTypes.FOCUS_INDEX_SET,
    focusIndex
  };
}

export function loadPage(page) {
  return {
    type: actionTypes.LOAD_PAGE,
    page
  };
}

export function loadPageStart(page) {
  return {
    type: actionTypes.LOAD_PAGE_START,
    page
  };
}

export function loadPageSuccess(payload) {
  return {
    type: actionTypes.LOAD_PAGE_SUCCESS,
    payload
  };
}

export function loadPageFailure(error) {
  return {
    type: actionTypes.LOAD_PAGE_FAILURE,
    error
  };
}
