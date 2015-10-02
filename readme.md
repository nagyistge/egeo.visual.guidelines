# Egeo Visual Guidelines

Hi! This is the repository of the Egeo Visual Guidelines website which contains the Stratio Design principles which guides the current generation of Stratio Apps. This project uses other Git projects which are interconnected via npm git dependencies.

The Egeo Visual Guidelines is built using [KSS](http://warpspire.com/kss/). Take it a look first if you want to modify it.

## How to install

Download the project to any folder via `git clone` or using the ZIP button and launch `npm install` to install all dependencies needed to build the website ([NodeJS](https://nodejs.org) and [Git client](https://git-scm.com/download/) are required to be installed first to can use these commands on your console).

```
git clone https://github.com/Stratio/egeo.ui.documentation.git

npm install
```

## Launch the website

You can see the website locally using a local webserver included with the project. Only use the `npm run-script serve` command and a local webserver will be launched in [http://localhost:9001](http://localhost:9001).

```
npm run-script serve
```

## Dependencies

This project needs the Egeo Base Framework to be built.

* [egeo.ui.base](https://github.com/Stratio/egeo.ui.base)
