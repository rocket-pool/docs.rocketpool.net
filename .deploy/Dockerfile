FROM node:20-alpine as builder
RUN npm install -g pnpm@8.6.7
WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM nginx:alpine
COPY .deploy/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
