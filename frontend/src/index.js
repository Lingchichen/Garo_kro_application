import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import RootReducer from 'ducks/RootReducer';
import AppContainer from './AppContainer';
import registerServiceWorker from 'registerServiceWorker';

/* Create the redux store to hold the application state.  Scenes and Containers
will listen for changes in the store, and rerender as necessary.  Also enable
the redux dev tools, and apply the thunk middleware.  The thunk middleware
makes writing complex action creators easier. */
const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

/* Provide the store the the application so that components can connect to it,
and spin up the application */
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);

/* Enables offline functionality. */
registerServiceWorker();
