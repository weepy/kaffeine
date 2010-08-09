#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');

function extend(object, properties) {
  for(key in properties) 
    object[key] = properties[key] 
}

require(lib + '/helpers').helpers.extend(global, require('sys'));
//require(lib + '/make').run();


// Based on CoffeeScript's Cake

var fs =          require('fs'),
    path:         require('path'),
    //helpers:      require('./helpers').helpers
    optparse:     require './optparse',
    Kaffeine: require '../lib/kaffeine'



// Keep track of the list of defined tasks, the accepted options, and so on.
var tasks= {}, options= {}, switches= [], oparse= null

// Mixin the top-level Make functions for Makefiles to use directly.
extend(global, {
  task: function(name, description, action) {
    if(!action) {
      action = description
      description = null
    }
    tasks[name]= {name:name, description:description, action:action}
  },
  option: function(letter, flag, description){
    switches.push([letter, flag, description])
  },
  invoke: function(name) {
    if(!tasks[name]) missingTask(name) 
    tasks[name].action(options)
  }
})

exports.run: function() {
  path.exists('Makefile', (exists) ->
    if(!exists)
      throw new Error("Cakefile not found in " + process.cwd())
    args = process.argv.slie(2..process.argv.length - 1)


    //CoffeeScript.run fs.readFileSync('Cakefile').toString(), {source: 'Cakefile'}
    oparse = new optparse.OptionParser switches
    if(!args.length) return printTasks()
    options = oparse.parse(args)
    for(var i = 0; i < options.arguments.length ; i++) {
      invoke(options.arguments[i])
    }
  })
}

function printTasks() {
  console.log('')
  for(var name in tasks) {
    var task = tasks[name]
    var spaces = 20 - name.length
    spaces = spaces > 0 ? (new Array(spaces)).join("") : ""
    var desc =   if task.description then "# $task.description" else ''
    console.log( "make " + name + spaces + desc)
    if(switches.length) console.log(  oparse.help() )
}

function missingTask(task) {
  console.log("No such task: \"" + task + "\"")
  process.exit(1)
}