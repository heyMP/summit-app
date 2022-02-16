FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM socialengine/nginx-spa as prod
WORKDIR /app
COPY --from=build /app/dist /app