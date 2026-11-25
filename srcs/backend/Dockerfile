FROM node:26-alpine3.24

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend/ ./

COPY shared/ /app/shared/

EXPOSE 3000

CMD ["npm", "run", "start:docker"]