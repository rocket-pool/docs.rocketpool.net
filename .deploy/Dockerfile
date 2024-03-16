FROM node:20-alpine as builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json .
COPY docs ./docs
RUN pnpm i
RUN pnpm run build
RUN pnpm prune --prod

#FROM oven/bun:latest as builder
#WORKDIR /app
#COPY ./package.json .
#COPY ./docs ./docs
#RUN bun install
#RUN bun run build

FROM nginx:alpine
COPY .deploy/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
