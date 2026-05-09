FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci

COPY . .

ARG DATABASE_URL="postgresql://postgres:postgres@db:5432/ticketing_db"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]