FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY r7l /usr/share/nginx/html

RUN date -u +"%Y-%m-%d %H:%M:%S " > /usr/share/nginx/html/build_version.txt

EXPOSE 80
