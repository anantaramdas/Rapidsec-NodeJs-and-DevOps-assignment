FROM node:12

# Install cron
RUN apt-get update && apt-get -y install apt-utils
RUN apt-get -y install cron

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Add files
#ADD ./.docker/run.sh /usr/src/app/run.sh
ADD ./.docker/entrypoint.sh ./entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

# Bundle app source
COPY ./dist/ ./
COPY ./.docker/wait-for-it.sh ./

ENTRYPOINT /usr/src/app/entrypoint.sh