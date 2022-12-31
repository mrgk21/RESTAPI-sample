## Overview and how to use?

This project showcases a login procedure using either username-password or your GitHub account. Upon login, you can perform REST operations on four different datasets. These are:

1. Getting all data
2. Getting specific data based on userId and/or id
3. Posting data into the dataset
4. Updating an existing data document
5. Deleting a data document

## System Architecture

![System Architecture](https://github.com/mrgk21/RESTAPI-sample/blob/main/docs_assets/system-architecture.png)
*System Architecture*

### Frontend

The frontend is coded with ReactJS and developed using Vite. Below I'll explain which packages I've used/development decisions and the reasoning behind them:

1. **Bootstrap** for HTML element styling. It reduces development time and maintains a consistent UI in mobile and desktop viewports.
2. **Axios** for handling HTTP requests. The options were Axios or fetch API, and I chose Axios as it also supports older browsers, automatically sets basic headers and supports async/await right out of the box.
3. **React-router-dom** for handling page navigation without site refresh. I chose this to reduce bugs during `gh-page` deployment, from my prior experience.
4. **Vite** for handling JSX transpiling and fast compilation. From my experience, the alternatives were, `create-react-app` which was easy to set up, but generated a slow site and was overall harder to debug; and `webpack` which gave a faster HMR and transparency to the compilation process, but required excessive setup & management for a project this size. Vite was the best of both worlds.
5. **gh pages** for site hosting. It's a free and easy way to showcase static page websites. The alternative was Railway, which deployed using package.json npm commands, but turned out to be inconsistent and not well documented. Railway didn't support docker-compose file, which meant manually setting docker run commands which might break during dev/prod.

### Backend

The backend uses a container architecture. Nginx is used as a reverse proxy with self-signed certificates (using OpenSSL) and rerouting from port 80 to 443. The API handling is done with a nodeJS container running the server code on port 5001. The containers are run on a raspberry pi which is always connected to the router to mimic a production server. The router has a static IP and is port forwarded from 1235 to 443 and 1234 to 80 for communicating with the Nginx container.

Below I'll explain which packages I've used/development decisions and the reasoning behind them:

1. **Nginx** as a reverse proxy to reroute all traffic to the server. The alternative solution to not use Nginx was to directly expose the server IP, which was a security risk. Another problem was that traditionally most hosting platforms did not support communicating with _http_ servers. To get an _https_ server for free, I used OpenSSL to self-sign the certificate, but ExpressJS had to out-of-the-box solution for _https_ certificates.
2. **Docker** for containerizing apps. I had 2 reasons to use docker, the images generated would be stable and portable directly to raspberry pi without much tinkering and this allowed for version control of docker images for a stable release. Another major reason would be that docker containers are easy to maintain and scale up as required.
3. **ExpressJS** for building API for backend.
4. **MongoDB** for database. I have prior experience in using MongoDB and Mongoose, which reduced my dev time.
5. **Typescript** helped with reducing bugs while developing.
6. **JWT** for user authentication. The other option would be to maintain session IDs for every login. Although session IDs are recommended, it meant setting up a token store and handling access and refresh token headers on both ends. It seemed overkill for a project this size, so I chose JWT, where I generate an access token with the user name and 30 minutes expiry, and a refresh token to regenerate the access token. All these are stored in sessionStorage.
7. **Morgan** for logging http requests during development. These requests were stored in a `dev.log` file and helped out during dev.
8. **Cors and Helmet** for adding CORS-specific headers and hiding irrelevant headers which may expose server details.

### Project Nuances and Caveats

1. During initial login, you need to log in through Github. This will redirect you to a **"not secure"** browser warning. The reason this happens is that the backend server is 1. Using a self-signed certificate 2. Does not have a DNS. Both these things are red flags for browsers and using a DNS has become practically mandatory and is reflected in every "free" backend hosting service. Please chose to accept the risk, as this will add the certificate to the browser and requests won't be blocked. This is the reason why regular login does not work out of the box.
2. Performing `POST`, `PUT` and `DELETE` requests won't show the changes made to the dataset. To view, the changes use `GET` instead.
3. There is no token store and all the tokens are stored only in memory. So in some cases, it might happen that the `logout` button "malfunctions". When a user logs in, a token is added to a stack, and logging out removes it. This means that if a second user does not log out and close the browser, his token will remain in the stack and will be popped, while still retaining your token. This means you'll have to log out twice. Because this app is not meant for scaling up to many users, a token store was not implemented.
4. Token authentication is handled by a middleware which reads the `Authentication bearer` header sent from the frontend. For regular login, access and refresh tokens are sent to the user. Only refresh tokens are stored in memory and logging out deletes them. This creates the "bug" mentioned in the previous point. For GitHub OAuth login, GitHub sends back an access token. During initial development, this access token was sent as a cookie, but this idea was scrapped due to the browser blocking cookies from servers without DNS. Instead, after completing the GitHub login process, the frontend requests the token from the server, which immediately `pops` it from the stack. This process happens in an average time of 300ms, varying depending on network conditions, which gives an average "bug-free" traffic of 3 users per second\* (not simultaneously) which meets the requirements.
