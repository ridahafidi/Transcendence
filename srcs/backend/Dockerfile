FROM node:26-alpine3.24

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]