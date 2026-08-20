FROM node:20-alpine AS build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY seed/ ./seed/
COPY seeder.js ./
COPY --from=build /app/client/dist ./client/dist

ENV NODE_ENV=production

RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
