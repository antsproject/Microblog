FROM node:18.17.1-alpine
WORKDIR /blogish
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./ /blogish
RUN rm -rf /blogish/node_modules
RUN npm i
CMD ["npm", "run", "dev"]
