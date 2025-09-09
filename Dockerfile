FROM node:alpine

COPY ./dist /app
COPY ./package.json .
COPY ./prisma /prisma

RUN npm install --omit=dev
RUN npx prisma db push
EXPOSE 1000
CMD ["node", "/app/index.js"]

