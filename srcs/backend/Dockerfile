FROM node:26-alpine3.24

WORKDIR /app

COPY backend/package*.json ./
COPY shared shared/

RUN npm install --install-links=true

COPY backend ./

EXPOSE 3000

CMD ["npm", "run", "start:docker"]