//StrengthAssessmentReviews.js
import Api from "Api";
import * as Alerts from "./Alerts";

//Constants
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

//Actions
const FETCH = "KRO/STRENGTHASSESSMENTREVIEWS/FETCH";
const SAVE = "KRO/STRENGTHASSESSMENTREVIEWS/SAVE";
const DELETE = "KRO/STRENGTHASSESSMENTREVIEWS/DELETE";

//Initial State
const initialState = {
  isFetching: false,
  isSaving: false,
  isDeleting: false,
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
    case DELETE:
      if (
        action.status &&
        (action.status === SUCCESS || action.status === ERROR)
      )
        return Object.assign({}, state, { isDeleting: false });
      return Object.assign({}, state, { isDeleting: true });
    default:
      return state;
  }
};

export const fetchStrengthAssessmentReviews = (
  token,
  callback = null
) => dispatch => {
  dispatch({ type: FETCH });
  new Api(token)
    .get("strength-assessment-reviews")
    .then(response => {
      dispatch({ type: FETCH, status: SUCCESS, payload: response.data });
      if (callback) callback();
    })
    .catch(error => {
      fetchStrengthAssessmentReviewsHandleError(dispatch, error);
    });
};

export const createReview = (token, review, callback = null) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .post("strength-assessment-reviews", review)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(
        fetchStrengthAssessmentReviews(token, () => {
          if (callback) callback(response.data);
        })
      );
    })
    .catch(error => {
      createReviewHandleError(dispatch, error);
    });
};

export const updateReview = (token, review, callback = null) => dispatch => {
  dispatch({ type: SAVE });
  new Api(token)
    .put("strength-assessment-reviews", review.id, review)
    .then(response => {
      dispatch({ type: SAVE, status: SUCCESS });
      dispatch(
        fetchStrengthAssessmentReviews(token, () => {
          if (callback) callback(response);
        })
      );
    })
    .catch(error => {
      updateReviewHandleError(dispatch, error);
      if(callback) callback(error.response);
    });
};

export const deleteReview = (token, review, callback = null) => dispatch => {
  dispatch({ type: DELETE });
  new Api(token)
    .delete("strength-assessment-reviews", review.id, review)
    .then(response => {
      dispatch({ type: DELETE, status: SUCCESS });
      dispatch(
        fetchStrengthAssessmentReviews(token, () => {
          if (callback) callback(response);
        })
      )
    })
    .catch(error => {
      deleteReviewHandleError(dispatch, error);
      if(callback) callback(error.response);
    });
};

//Helper Functions
const fetchStrengthAssessmentReviewsHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const createReviewHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const updateReviewHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: SAVE, status: ERROR });
  if (error.response) {
    if (error.response.status >= 500) dispatch(internalServerError());
    else dispatch(badRequestError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const deleteReviewHandleError = (dispatch, error) => {
  console.log(error);
  dispatch({ type: DELETE, status: ERROR });
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
