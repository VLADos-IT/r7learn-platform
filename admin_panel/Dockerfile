FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine AS admin
COPY --from=build /app/dist /usr/share/nginx/html/admin_r7learn
