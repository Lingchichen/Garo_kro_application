//Milestones.js
import Api from 'Api';
import * as Alerts from './Alerts';

//Constants
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';

//Actions
const FETCH = 'KRO/MILESTONES/FETCH';
const SAVE = 'KRO/PROJECTS/SAVE';

//Initial State
const initialState = {
  isFetching: false,
  isSaving: false,
  items: []
};

//Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
      if (action.status && action.status === SUCCESS)
        return Object.assign({}, state, {
          isFetching: false,
          items: action.payload
        });
      if (action.status && action.status === ERROR)
        return Object.assign({}, state, {
          isFetching: false
        });
      return Object.assign({}, state, { isFetching: true });
    case SAVE:
      //two different conditions with identical outcomes.
      if (
        action.status &&
        (action.status === SUCCESS || action.status === ERROR)
      )
        return Object.assign({}, state, { isSaving: false });
      return Object.assign({}, state, { isSaving: true });
    default:
      return state;
  }
};

//Async Thunks
export const fetchMilestones = (token, callback = null) => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get('milestones')
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
      if (callback) callback();
    })
    .catch(error => {
      fetchMilestonesHandleError(dispatch, error);
    });
};

export const createMilestone = (token, newMilestone, callback) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .post('milestones', newMilestone)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(
        fetchMilestones(token, () => {
          callback(response.data);
        })
      );
    })
    .catch(error => {
      createMilestoneHandleError(dispatch, error);
    });
};

export const updateMilestone = (token, newMilestone, callback) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .put('milestones', newMilestone.id, newMilestone)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(
        fetchMilestones(token, () => {
          callback(response.data);
        })
      );
    })
    .catch(error => {
      updateMilestoneHandleError(dispatch, error);
    });
};

//Helper Functions
const fetchMilestonesHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const createMilestoneHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const updateMilestoneHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const badRequestError = () => Alerts.addAlert(Alerts.DANGER, 'Bad Request');

const internalServerError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Internal Server Error.');

const noResponse = () =>
  Alerts.addAlert(Alerts.DANGER, 'No response received from server.');

const unknownError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Could not send request to the server.');
