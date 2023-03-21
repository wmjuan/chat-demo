# build stage
FROM node:12.18.1-alpine3.11 as build-stage
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build:prod

# production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]