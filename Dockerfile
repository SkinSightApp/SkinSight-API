FROM node:20.13.1-bullseye
WORKDIR /src
ENV PORT 8080
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]
