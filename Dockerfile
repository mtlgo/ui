FROM mhart/alpine-node
# FROM mhart/alpine-node:base-0.10
# FROM mhart/alpine-node

WORKDIR /docker-ui
ADD . .
RUN apk add --no-cache curl make gcc g++ python 
RUN npm install

EXPOSE 4200
CMD ["npm","start"]
