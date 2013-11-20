'use strict';

/**
 * Module dependencies.
 */

var http = require('http'),
  path = require('path');

var express = require('express'),
  swig = require('swig'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

require('./server/util');

var config = require('./server/config'),
  route = require('./server/route');


var app = express();

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));

app.db2 = mongoose.createConnection(config.mongodb.uri2);
app.db2.on('error', console.error.bind(console, 'db2 mongoose connection error: '));

app.db.once('open', function () {
  console.log('db opened');

  for(var name in config.mongodb.collection) {
    var modal = name.upperFirst();

    var schema = app.db[modal + 'Schema'] = new Schema(config.mongodb.collection[name].schema, config.mongodb.collection[name].option);

    app.db[modal] = app.db.model(modal, schema);

    var t = new app.db[modal]({name: 'dsfsf'});
    t.validate(function(err) {
      console.log('err', err);
    });

    app.config = app.config || {};
    app.config[modal] = {};
    // app.config[modal].push({k: 'id', v: 'ID'});

    var schema = {};
    schema.id = config.mongodb.collection[name].schema.id || {type: String, label: 'ID'};
    for(var k in config.mongodb.collection[name].schema) {
      if(config.mongodb.collection[name].schema.hasOwnProperty(k)) schema[k] = config.mongodb.collection[name].schema[k];
    }
    app.config[modal].schema = schema;
    app.config[modal].option = config.mongodb.collection[name].option;

    // for(var k in config.mongodb.collection[name].schema) {
    //   app.config[modal].push({k: k, v: config.mongodb.collection[name].schema[k].label});
    // }
  }
  console.log(typeof app.config.Work.schema.like.type[0]);
});

app.db2.once('open', function() {
  console.log('db2 opened');

  var User = app.db2.model('User', new Schema({
    uid: {type: String},
    pwd: {type: String, required: true}
  }, {collection: 'user'}));

  var u = new User({uid: 123456});
  u.validate(function(err) {
    console.log('user save err ', err);
  });
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'server/view'));
// This is where all the magic happens!
app.engine('html', swig.renderFile);

swig.setFilter('inputtype', function(input) {
  switch(typeof input) {
    case 'boolean':
      return 'checkbox';
      break;

    case 'string':
      return 'text';
      break;

    case 'number':
      return 'number';
      break;

    case 'boolean':
      return 'checkbox';
      break;

    case 'boolean':
      return 'checkbox';
      break;

    default:
      return 'hidden';
      break;    
  }
});

swig.setFilter('listtype', function(input) {
  if('boolean' == typeof input) return 'checkbox';
});

app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

route(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
