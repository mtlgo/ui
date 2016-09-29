# Docker UI (Alpha - Prototype)
[![Build Status](https://travis-ci.org/mtlgo/docker-ui.svg?branch=master)](https://travis-ci.org/mtlgo/docker-ui)
![Imgur](http://i.imgur.com/e51MQiC.png)
## Note

This project is built upon the **Angular-cli** for Angular 2. You can browse [the repository for further information about the CLI](https://github.com/angular/angular-cli). For the nitty-gritty details of the Angular-cli Webpack configuration, you can have a look on [this file](https://github.com/angular/angular-cli/blob/master/addon/ng2/models/webpack-build-common.ts).

### Compilation and Build stack

- [x] [Webpack 2](https://webpack.github.io/docs/roadmap.html#2)
- [x] [Typescript 2](https://blogs.msdn.microsoft.com/typescript/2016/07/11/announcing-typescript-2-0-beta/)

# Getting Started 

## [Supported tags](https://hub.docker.com/r/mtlgo/docker-ui/tags/) for `mtlgo/docker-ui` image

-	`latest` (*target the latest master branch release*)

### Run a container
```bash
docker run -dt -p 5000:4200 mtlgo/docker-ui
```

Or you can build your own image following the process below.

### Build a docker-ui image
```bash
docker build -t docker-ui .
```

# Development

## Prerequisites

It's not mandatory, but you can install the angular-cli for convenience.
```bash
npm install -g angular-cli@webpack
```

## Installation

```bash
npm install
```

## Run
Run a Webpack dev server 
```bash
npm start
```

## Build Only
Build a development release
```bash
npm run build
```
