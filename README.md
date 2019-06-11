# KRO Project Instructions and Info

## Software Installation

* Python
* virtualenv (pip install virtualenv)
* Node

## Frameworks / Libraries used by the project

* Django
* Django Rest Framework
* React
* Redux
* Redux Thunk
* Sass

## Steps to run

* First-time
  * Get code from repository
  * Open a command line in the project folder (example: `C:\Users\tyler\Documents\kro\`)
  * Create virtual environment `virtualenv --no-site-packages .` (don't forget the dot at the end)
  * Activate virtual environment `Scripts\activate`
  * Download python dependencies `pip install -r requirements.txt`
  * Run database migration scripts `python manage.py migrate`
  * Create a django super user `python manage.py createsuperuser`
  * Change directory to the frontend `cd frontend`
  * Download frontend dependencies `npm install`
  * Go back to root project folder `cd ..`
  * Run the django server `python manage.py runsslserver`
  * Open a new command line and navigate to the frontend folder
  * Run the frontend development server `set HTTPS=true&&npm start`
  * The app should be running now.
* Everytime after
  * Open a command line in the project folder (example: `C:\Users\tyler\Documents\kro\`)
  * Run the django server `python manage.py runsslserver`
  * Open a new command line and navigate to the frontend folder
  * Run the frontend development server `set HTTPS=true&&npm start`
  * The app should be running now.

## DB and Models

The main models for the project are defined in `backend/kro/models.py`. Whenever these are changed, you will want to stop the django server (`ctrl + c`) and run the following command `python manage.py makemigrations kro` This will create a new migration script that reflects your changes to the model. After than, run `python manage.py migrate` to actually run the migration, and then restart the django server. Your changes should now be in place.

## Django and Django Rest Framework

With the exception of the view which serves the react application itself, all the views serve as REST endpoints for the models. These endpoints are implemented using Django Rest Framework (DRF). This allows the frontend to talk directly to the model by making CRUD requests to the server. For example, to get a list of all the meetings in the system, one just makes a GET request to `https://[domain]/api/v1/meetings/`, which will return a list of all meetings in JSON format.

### Authentication

These requests will only be accepted if the request includes an Authorization header. It would look like this `Authorization: Token [api token]`. The token would be a random looking string. To obtain a token, you must first make a POST request to `https://[domain]/api/v1/api-token-auth/`, and the body of that request must look like this:

```
{
    "username": "[Your username here]",
    "password": "[Your password here]"
}
```

The server will return a response like this:

```
{
    "token": "94ea7287187faa4c229309ecdca1b182284cfe17"
}
```

And that is your token. Include this will all requests to the REST API. This is how the app handles login. When a user successfuly logs in, the token is saved in the browser and is included with all requests after.

To play around with the API itself, I recommend installing an application on your computer called "postman". It's very handy.

## Sass

The project is mostly using Sass for the frontend styles. If you aren't familiar with it already, Sass is a preprocessor for css. I'd recommend learning it, as it has a lot of helpful features that regular css does not.

## Frontend structure

The folder structure is as follows on the frontend:

* `index.js` - The main javascript file. This should rarely need to be changed.
* `registerServiceWorker.js` - This is for offline capabilities. It's not really relevant for this project.
* `Api.js` - A helper utility that wraps around axios, which is used to make all those api requests.
* `AppContainer.js` - The first react component to be rendered. It checks for a valid Api token, and if there isn't one, it shows the login screen. Otherwise, it renders the actual app.
* `style.scss` - Styles for the app container.
* `utilities/` - General utilities. Date manipulation and things like that. Nothing React/Redux specific here.
* `styles/` - global style stuff. Variables and things like that, which can be included in other scss files.
* `images/` - pretty self explanatory, icons and stuff
* `ducks/` - These are "ducks", a pattern for organizing Actions, Reducers, etc for Redux. Google "Redux ducks" for more info on this pattern.
* `components/` - "Dumb" React components. These don't have any connection to the Redux store.
* `containers/` - "Smart" React components. These are connected to the redux store, and may or may not change the application state.
* `scenes/` - Different screens of the app. May also be connected to the Redux store.
  * Scenes can have their own `containers` and `components`, as well as nested `scenes`.
  * Containers can have their own `containers` and `components`.
  * Components can have their own `components`.

## Component Styles

Many components have a `style.scss` file, which compiles to a `style.css` file. That css file is then included in the components javascript file. This tells the build system to include this css.
