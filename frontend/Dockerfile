FROM node:19-alpine3.15

WORKDIR /frontend
COPY package.json .
COPY yarn.lock .
COPY vite.config.js .
RUN yarn install
COPY . .
CMD ["yarn", "preview"]