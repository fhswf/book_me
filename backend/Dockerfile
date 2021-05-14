FROM node:16-buster

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install 
COPY . /usr/src/app
EXPOSE 5000
RUN npm run-script build
CMD [ "npm", "start" ]