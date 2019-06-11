//MeetingAttendance.js
import Api from 'Api';
import * as Alerts from './Alerts';

//Constants
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';

//Actions
const FETCH = 'KRO/MEETINGATTENDANCE/FETCH';
const SAVE = 'KRO/MEETINGATTENDANCE/SAVE';

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

export const fetchMeetingAttendance = token => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get('meeting-attendance')
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
    })
    .catch(error => {
      fetchMeetingAttendanceHandleError(dispatch, error);
    });
};

export const saveAttendance = (token, currentAttendance, attendance) => {
  return dispatch => {
    dispatch({ type: SAVE });
    let toDelete = currentAttendance.filter(
      cAtt => (attendance.find(({ id }) => id === cAtt.id) ? false : true)
    );
    let toUpdate = currentAttendance.filter(
      cAtt => (attendance.find(({ id }) => id === cAtt.id) ? true : false)
    );
    let toCreate = attendance.filter(nAtt => (nAtt.id ? false : true));
    let api = new Api(token);
    let promises = toDelete
      .map(att => api.delete('meeting-attendance', att.id))
      .concat(toUpdate.map(att => api.put('meeting-attendance', att.id, att)))
      .concat(toCreate.map(att => api.post('meeting-attendance', att)));
    Promise.all(promises)
      .then(() => {
        dispatch({ type: SAVE, status: SUCCESS });
        dispatch(fetchMeetingAttendance(token));
      })
      .catch(error => {
        saveAttendanceHandleError(dispatch, error);
      });
  };
};

//Helper Functions
const fetchMeetingAttendanceHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const saveAttendanceHandleError = (dispatch, error) => {
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
