# RESTAPI sample project

## Overview
The backend of the app is build with Express, using Typescript. The user is expected to login/register initially using username & password, or alternatively using his github account. After successful login, the server will send access and refresh tokens for the user session. These are stored in session storage. Afterwards, the user will be rerouted back to the home page. Alternatively, on github login only access token is stored in session storage and token expiry is handled by github itself.

There are 4 data collections: posts, comments, albums, todo, taken directly from json placeholder and stored on mongoDB Atlas, along with the login credentials. In every form, the user can perform all REST operations and all data can be viewed by an empty GET request. Errors are displayed in the console.

For ease of access, i've used docker to build images for both front and backend. These images are uploaded in my dockerhub under `mrgk21/rest-api`. I've build a common docker-compose file to run on any local system, which pulls these images and runs the containers.

## How to use
1. Install docker engine from official site
2. Download `docker-compose.yaml` file
3. Run `docker compose up`, or `docker-compose up` if you have installed the docker-compose package
