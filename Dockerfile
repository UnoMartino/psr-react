FROM node:16 as build-step

RUN mkdir /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY public/ /app/public/

COPY src/ /app/src/

COPY package-lock.json /app

COPY tailwind.config.js /app

RUN npm run build



FROM nginx:1.17.1-alpine

COPY --from=build-step /app/build /usr/share/nginx/html

