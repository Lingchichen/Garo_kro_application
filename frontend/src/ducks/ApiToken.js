import Api from 'Api';
import * as Alerts from './Alerts';

//Constants
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';

//Action Types
const FETCH = 'KRO/APITOKEN/FETCH';
const RESET = 'KRO/APITOKEN/RESET';
const VALIDATE = 'KRO/APITOKEN/VALIDATE';
const INVALIDATE = 'KRO/APITOKEN/INVALIDATE';

//Initial State
//Check if there is an apiToken already saved to local or session storage first.
let token = '';
if (sessionStorage.apiToken) token = sessionStorage.apiToken;
else if (localStorage.apiToken) token = localStorage.apiToken;

const initialState = {
  isFetching: false,
  valid: null,
  value: token
};

//Reducer.  Defines how the state changes in response to dispatched actions.
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
      if (action.status && action.status === SUCCESS)
        return {
          isFetching: false,
          valid: true,
          value: action.payload
        };
      if (action.status && action.status === ERROR)
        return Object.assign({}, state, {
          isFetching: false,
          valid: false
        });
      return Object.assign({}, state, { isFetching: true });
    case RESET:
      return {
        isFetching: false,
        valid: false,
        value: ''
      };
    case VALIDATE:
      return Object.assign({}, state, { valid: true });
    case INVALIDATE:
      return Object.assign({}, state, { valid: false });
    default:
      return state;
  }
};

//Action Creators
export const logout = () => {
  /* Delete the apiToken from local and session storage, then reset it in the
  redux store. */
  if (sessionStorage.apiToken) sessionStorage.apiToken = '';
  if (localStorage.apiToken) localStorage.apiToken = '';
  return {
    type: RESET
  };
};

//Async Thunks
export const checkToken = token => dispatch => {
  //Make an api request to the api root.  Just to check if the token works.
  new Api(token)
    .get('')
    .then(() => {
      //The api responded with an OK, so set the token as valid.
      dispatch({ type: VALIDATE });
    })
    .catch(error => {
      checkTokenHandleError(dispatch, error);
    });
};

export const login = (username, password, remember) => dispatch => {
  /* To "login", we need to send the username and password to the api and
  receive a token if they are valid.  Start by telling the store that the token
  is in the fetching state. */
  dispatch({ type: FETCH });
  new Api()
    .post('api-token-auth', { username, password })
    .then(response => {
      /* Received a token, so save it in the session storage, as well as the
      more persistent local storage if the remember me field is set.  Then save
      it to the redux store. */
      let newToken = response.data.token;
      sessionStorage.apiToken = newToken;
      if (remember) localStorage.apiToken = newToken;
      dispatch({ type: FETCH, status: SUCCESS, payload: newToken });
    })
    .catch(error => {
      loginHandleError(dispatch, error);
    });
};

//Error Handling
const checkTokenHandleError = (dispatch, error) => {
  /* Log the error on the console, and check the response (if there is one).  The token is probably invalid for some reason. */
  console.log(error);
  if (error.response) {
    if (error.response.status === 401) dispatch({ type: INVALIDATE });
    else if (error.response.status >= 500) dispatch(internalServerError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const loginHandleError = (dispatch, error) => {
  /* Log the error on the console, and check the response (if there is one).  The user probably just entered in the wrong login info. */
  console.log(error);
  dispatch({ type: FETCH, status: ERROR });
  if (error.response) {
    if (error.response.status >= 400) dispatch(invalidCredentials());
    else if (error.response.status >= 500) dispatch(internalServerError());
  } else if (error.request) dispatch(noResponse());
  else dispatch(unknownError());
};

const invalidCredentials = () =>
  Alerts.addAlert(Alerts.DANGER, 'Invalid Login Credentials.');

const internalServerError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Internal Server Error.');

const noResponse = () =>
  Alerts.addAlert(Alerts.DANGER, 'No response received from server.');

const unknownError = () =>
  Alerts.addAlert(Alerts.DANGER, 'Could not send request to the server.');
