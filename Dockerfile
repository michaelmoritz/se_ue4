FROM node:12.4.0
WORKDIR /se_ue4
COPY package.json /se_ue4
RUN npm install
COPY . .
CMD npm start
EXPOSE 8080