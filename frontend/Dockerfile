# Frontend Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

RUN npm run build