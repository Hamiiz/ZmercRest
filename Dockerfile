FROM node:alpine
COPY ./package.json .
COPY ./prisma /prisma
RUN npm install
COPY . .
RUN --mount=type=secret,id=database_url \
    DATABASE_URL=$(cat /run/secrets/database_url) \
    npx prisma db push --force

# Build TypeScript
RUN tsc
EXPOSE 1000
CMD ["node", "/dist/index.js"]

