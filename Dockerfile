FROM node:19

RUN git clone "https://github.com/WebexSamples/hookbuster.git"

WORKDIR /hookbuster

RUN npm install

ENTRYPOINT ["node", "app.js"]