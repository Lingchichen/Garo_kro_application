//StrengthAssessmentValues.js
import Api from "Api";
import * as Alerts from "./Alerts";

//Constants
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

//Actions
const FETCH = "KRO/STRENGTHASSESSMENTVALUES/FETCH";
const SAVE = "KRO/STRENGTHASSESSMENTVALUES/SAVE";

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

export const fetchStrengthAssessmentValues = (
  token,
  callback = null
) => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get("strength-assessment-values")
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
      if (callback) callback();
    })
    .catch(error => {
      fetchStrengthAssessmentValuesHandleError(dispatch, error);
    });
};

export const saveStrengthAssessmentValues = (
  token,
  assessmentValues,
  callback
) => dispatch => {
  dispatch({ type: SAVE });
  let api = new Api(token);
  let promises = assessmentValues.map(av =>
    api.post("strength-assessment-values", av)
  );
  Promise.all(promises)
    .then(() => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(fetchStrengthAssessmentValues(token, callback));
    })
    .catch(error => {
      saveStrengthAssessmentValuesHandleError(dispatch, error);
    });
};

//Helper Functions
const fetchStrengthAssessmentValuesHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const saveStrengthAssessmentValuesHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const badRequestError = () => Alerts.addAlert(Alerts.DANGER, "Bad Request");

const internalServerError = () =>
  Alerts.addAlert(Alerts.DANGER, "Internal Server Error.");

const noResponse = () =>
  Alerts.addAlert(Alerts.DANGER, "No response received from server.");

const unknownError = () =>
  Alerts.addAlert(Alerts.DANGER, "Could not send request to the server.");
