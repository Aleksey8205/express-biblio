FROM node:24.4.1-alpine
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
CMD  ["npm", "run", "dev"]