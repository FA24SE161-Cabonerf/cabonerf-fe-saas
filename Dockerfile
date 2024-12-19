FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./

# Cập nhật registry npm, làm sạch cache, và thêm logic retry
RUN npm config set registry https://registry.npmjs.org/ \
    && npm cache clean --force \
    && npm ci --retry 3 --loglevel verbose

COPY . .
RUN npm run build

FROM nginx:stable-alpine

WORKDIR /app
COPY --from=build /app/build /app/html
COPY nginx.conf /app
RUN mkdir -p /app/run && apk add --no-cache bash curl

EXPOSE 80

CMD ["nginx", "-c", "/app/nginx.conf"]
