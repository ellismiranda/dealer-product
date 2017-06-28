FROM node:8

# Install app dependencies
COPY ./package.json /usr/src/app/
WORKDIR /usr/src/app/
ENV NODE_ENV=development
RUN npm set progress false && npm install --loglevel warn

# Copy the source in
COPY . /usr/src/app/

EXPOSE 3000
