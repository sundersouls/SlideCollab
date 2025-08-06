FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN mkdir -p /app/prisma

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

EXPOSE 5000


CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]