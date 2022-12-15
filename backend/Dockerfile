FROM node:19-alpine3.15

WORKDIR /backend
COPY package-lock.json .
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
RUN npm install
COPY . .
CMD ["npm", "start"]