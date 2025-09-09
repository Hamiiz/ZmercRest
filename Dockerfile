FROM node:alpine

COPY ./package.json .
COPY ./prisma /prisma
RUN npm install
COPY . .
RUN npx prisma db push
RUN tsc
EXPOSE 1000
CMD ["node", "/dist/index.js"]

