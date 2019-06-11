//EmployeeDevelopmentPlanReviews.js
import Api from "Api";
import * as Alerts from "./Alerts";

//Constants
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

//Actions
const FETCH = "KRO/EMPLOYEEDEVELOPMENTPLANREVIEWS/FETCH";
const SAVE = "KRO/EMPLOYEEDEVELOPMENTPLANREVIEWS/SAVE";

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

export const fetchEmployeeDevelopmentPlanReviews = (
  token,
  callback = null
) => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get("employee-development-plan-reviews")
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
      if (callback) callback();
    })
    .catch(error => {
      fetchEmployeeDevelopmentPlanReviewsHandleError(dispatch, error);
    });
};

export const createDevPlanReview = (token, review, callback) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .post("employee-development-plan-reviews", review)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(fetchEmployeeDevelopmentPlanReviews(token, () => {
        if(callback) callback(response.data);
      }));
    })
    .catch(error => {
      createDevPlanReviewHandleError(dispatch, error);
    });
};

export const updateDevPlanReview = (token, review, callback = null) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .put("employee-development-plan-reviews", review.id, review)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(fetchEmployeeDevelopmentPlanReviews(token, () => {
        if(callback) callback(response);
      }));
    })
    .catch(error => {
      updateDevPlanReviewHandleError(dispatch, error);
      if(callback) callback(error.response);
    });
};

//Helper Functions
const fetchEmployeeDevelopmentPlanReviewsHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const createDevPlanReviewHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const updateDevPlanReviewHandleError = (dispatch, error) => {
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
