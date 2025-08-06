FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

ARG REACT_APP_SERVER_URL=http://localhost:5000
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]