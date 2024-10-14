FROM oven/bun:latest AS ui
WORKDIR /app
COPY ./doc_build ./doc_build

FROM 285465855463.dkr.ecr.us-east-1.amazonaws.com/interstage:latest
WORKDIR /server
ENV SERVER_PORT=80
COPY --from=ui /app/doc_build ./ui/dist

EXPOSE 80
CMD ["/server/start"]
