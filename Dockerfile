FROM node:alpine
COPY ./package.json .
COPY ./prisma /prisma
RUN npm install
COPY . .
RUN --mount=type=secret,id=supabase_db,env=DATABASE_URL="${SUPABASE_DB}" \
    npx prisma db push \
    tsc
EXPOSE 1000
CMD ["node", "/dist/index.js"]

