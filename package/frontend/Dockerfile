# build
FROM node:18-alpine as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# serve
FROM nginx:alpine
COPY --from=build /app/dist/app /usr/share/nginx/html

EXPOSE 80
