#!/usr/bin/env node

var http = require('http');
var url = require('url');
var pathExtra = require('path-extra');
var program = require('commander');
var express = require('express');
var printit = require('printit');
var cozy = require('./lib.js');
var actions = cozy.actions;
var configHelpers = cozy.configHelpers;

var pkg = require('./package.json');

// Constants
const LOGGER = printit({ prefix: 'Cozy Light' });

// CLI

program
  .version(pkg.version);

program
  .command('start')
  .option('-p, --port <port>', 'port number on which Cozy Light is available')
  .description('start Cozy Light server')
  .action(actions.start);

program
  .command('install <app>')
  .description('Add app to current Cozy Light')
  .action(actions.installApp);

program
  .command('uninstall <app>')
  .description('Remove app from current Cozy Light')
  .action(actions.uninstallApp);

program
  .command('add-plugin <plugin>')
  .description('Add plugin to current Cozy Light')
  .action(actions.installPlugin);

program
  .command('remove-plugin <plugin>')
  .description('Remove plugin from current Cozy Light')
  .action(actions.uninstallPlugin);

program
  .command('display-config')
  .description('Display current config of Cozy Light')
  .action(actions.displayConfig);

program
  .command('*')
  .description('display help')
  .action(program.outputHelp);


// Init Cozy Light

configHelpers.init(pathExtra.homedir(), program);


program.parse(process.argv);

// If arguments doesn't match any of the one set, it displays help.

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Manage errors

process.on('uncaughtException', function (err) {
  if (err) {
    LOGGER.warn('An exception is uncaught');
    LOGGER.raw(err);
    console.log(err.stack);
    actions.exit();
  }
});


// Manage termination

process.on('SIGINT', actions.exit);