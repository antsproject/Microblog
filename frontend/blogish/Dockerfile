# Naively Simple Node Dockerfile
FROM node:18.17.1-alpine
RUN echo "node:18.17.1-alpine"
RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
RUN echo "RUN copy"
COPY --chown=node:node . .
USER node
RUN echo "npm build"
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
