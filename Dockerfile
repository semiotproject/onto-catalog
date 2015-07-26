FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm

# debian installs `node` as `nodejs`
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

VOLUME ["/webapp"]

ADD . /webapp
RUN cd /webapp && npm i -g grunt-cli && npm i

EXPOSE 3000

WORKDIR /webapp

CMD ["npm", "run", "serve"]