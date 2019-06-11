FROM node:12.4.0
WORKDIR /se_ue4/server
COPY package.json /se_ue4/server
RUN npm install
COPY . .
CMD npm start
EXPOSE 3000