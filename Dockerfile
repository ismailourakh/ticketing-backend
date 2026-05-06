FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

ARG DATABASE_URL="postgresql://postgres:postgres@db:5432/ticketing_db"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["npm", "start"]