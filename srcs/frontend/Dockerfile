FROM node:26-alpine3.24

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ENTRYPOINT npm run dev
