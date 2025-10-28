FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM node:20-alpine AS admin-build
WORKDIR /admin
COPY admin_panel/package*.json ./
RUN npm install
COPY admin_panel .
RUN npm run build

FROM nginx:alpine

COPY --from=frontend-build /frontend/dist /usr/share/nginx/html/r7l
COPY --from=admin-build /admin/dist /usr/share/nginx/html/admin_r7learn

COPY nginx/r7learn.xorg.su.conf /etc/nginx/conf.d/r7learn.xorg.su.conf
COPY nginx/admin.r7learn.xorg.su.conf /etc/nginx/conf.d/admin.r7learn.xorg.su.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
