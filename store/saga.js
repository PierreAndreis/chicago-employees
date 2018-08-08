import {
  all,
  put,
  select,
  takeLatest,
  takeEvery,
  call
} from "redux-saga/effects";
import API from "./../lib/api";
import es6promise from "es6-promise";

import {
  actionTypes,
  loadPageFailure,
  loadPageSuccess,
  loadPageStart,
  setFocusIndex
} from "./actions";

import { getFilteredEmployees } from "./computed";

es6promise.polyfill();

// Select used for the sagas
const getFocusIndex = state => state.focusIndex;
const getEmployeeList = state => getFilteredEmployees(state);
const getPage = state => state.page;
const getPageSize = state => state.pageSize;

// Fetch data from API for the page
function* loadPageSaga(action) {
  yield put(loadPageStart(action.page));

  const pageSize = yield select(getPageSize);
  try {
    const res = yield API.list(action.page, pageSize);
    yield put(loadPageSuccess(res));
  } catch (err) {
    yield put(loadPageFailure(err));
  }
}

// Switch focus to either next or previous
// If there is no next on current page, fetch new page and focus first
// if there is no previous on current page, fetch previous page and focus last
function* switchFocusSaga(action) {
  let focusIndex = yield select(getFocusIndex);

  if (action.type === actionTypes.FOCUS_INDEX_NEXT) focusIndex += 1;
  if (action.type === actionTypes.FOCUS_INDEX_PREV) focusIndex -= 1;

  const items = yield select(getEmployeeList);
  const currPage = yield select(getPage);
  let newPage = currPage;

  let sizeOfData = items.length;

  // Go to next page?
  if (focusIndex >= sizeOfData) {
    newPage += 1;
    // Start at the beginning
    focusIndex = 0;
  }

  // should new focus be the last item?
  let shouldBeLast = false;

  // If at the first index, and
  // arrowKeyUp is pressed, it will
  // try to go to previous page and focus the last
  if (focusIndex < 0) {
    newPage = currPage - 1;

    // If page is valid ...
    if (newPage > 0) {
      // We will fetch previous page,
      // but don't know how many item is in the list
      // so schedule for after fetching
      // to set index
      shouldBeLast = true;
    }
    // ...if not, make it valid and don't change focus.
    else {
      newPage = 1;
      focusIndex = 0;
    }
  }

  if (newPage !== currPage) {
    // this saga can only continue after loadPageSaga is done
    yield call(loadPageSaga, { page: newPage });

    const newItems = yield select(getEmployeeList);
    sizeOfData = newItems.length;

    if (shouldBeLast) {
      // Now that we know what is the previous page, set focus to last
      focusIndex = sizeOfData - 1;
    }
  }

  // FocusIndex can be NaN if sizeOfData is 0,
  // and sizeOfData is 0 when either:
  // -> A filter is active and no employee on the current page matches this filter
  // -> No employee found on this page
  if (isNaN(focusIndex)) focusIndex = 0;

  yield put(setFocusIndex(focusIndex));
}

function* rootSaga() {
  yield all([
    takeLatest(actionTypes.LOAD_PAGE, loadPageSaga),

    takeEvery(actionTypes.FOCUS_INDEX_NEXT, switchFocusSaga),
    takeEvery(actionTypes.FOCUS_INDEX_PREV, switchFocusSaga)
  ]);
}

export default rootSaga;
