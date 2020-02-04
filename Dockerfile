# specify the node base image with your desired version node:<version>
FROM node:10
# replace this with your application's default port
EXPOSE 8080
WORKDIR /usr/src/app

RUN npm install connect express mqtt

COPY src .

CMD [ "node", "app_express.js"]
