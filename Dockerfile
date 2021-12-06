FROM node:14.16.1-alpine3.13 AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

ARG API_URL=http://api

RUN yarn build

CMD [ "yarn", "start" ]
