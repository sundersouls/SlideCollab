FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

EXPOSE 5000

RUN mkdir -p /app/prisma

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

CMD ["sh", "-c", "npx prisma migrate deploy && (npm run dev 2>/dev/null || npx ts-node server.ts)"]