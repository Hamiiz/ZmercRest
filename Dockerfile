FROM node:alpine
RUN --mount=type=secret,id=github_token,env=GITHUB_TOKEN \
    --mount=type=secret,id=supabase_db,env=SUPABASE_DB \
    --mount=type=secret,id=jwt_secret,env=JWT_SECRET \
    --mount=type=secret,id=better_auth_secret,env=BETTER_AUTH_SECRET \
    --mount=type=secret,id=google_client_id,env=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=google_client_secret,env=GOOGLE_CLIENT_SECRET \
    --mount=type=secret,id=gh_client_id,env=GITHUB_CLIENT_ID \
    --mount=type=secret,id=gh_client_secret,env=GITHUB_CLIENT_SECRET \
    --mount=type=secret,id=chapa_secret_key,env=CHAPA_SECRET_KEY \
    --mount=type=secret,id=cloudinary_secret,env=CLOUDINARY_SECRET \
    --mount=type=secret,id=cloudinary_api_key,env=CLOUDINARY_API_KEY \
    --mount=type=secret,id=cloudinary_cloud_name,env=CLOUDINARY_CLOUD_NAME \
    --mount=type=secret,id=brevo,env=BREVO \
    --mount=type=secret,id=cloudname,env=CLOUDNAME \
    --mount=type=secret,id=telebirr_merchant_id,env=TELEBIRR_MERCHANT_ID \
    --mount=type=secret,id=fabric_app_id,env=FABRIC_APP_ID \
    --mount=type=secret,id=short_code,env=SHORT_CODE \
    --mount=type=secret,id=app_secret,env=APP_SECRET \
    --mount=type=secret,id=telebirr_private_key,env=TELEBIRR_PRIVATE_KEY \
    --mount=type=secret,id=tb_base_url,env=TB_BASE_URL \
    --mount=type=secret,id=web_base_url,env=WEB_BASE_URL \
    --mount=type=secret,id=frontend_url,env=FRONTEND_URL \
    --mount=type=secret,id=api_base_url,env=API_BASE_URL \
    --mount=type=secret,id=jwt_issuer,env=JWT_ISSUER 
COPY ./package.json .
COPY ./prisma /prisma
RUN npm install
COPY . .
RUN npx prisma db push
RUN tsc
EXPOSE 1000
CMD ["node", "/dist/index.js"]

