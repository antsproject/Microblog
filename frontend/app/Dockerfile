FROM node:18.17.1-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./ /app
RUN rm -rf /app/node_modules
RUN npm i
CMD ["npm", "run", "start"]
