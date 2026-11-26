FROM node:26-alpine3.24

WORKDIR /app

COPY frontend/package*.json ./
COPY shared shared/

RUN npm install --install-links=true

COPY frontend .

EXPOSE 5173

ENTRYPOINT npm run dev -- --host 0.0.0.0
