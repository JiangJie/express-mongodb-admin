'use strict';

var async = require('async');

var config = require('../config');

// all routers

var self = {};

var per = 20;

function index(req, res, next) {
  var navs = req.next.navs;

  return res.render('index', {navs: navs});
}

function fill(req, res, next) {
  var collection = config.mongodb.collection;

  var navs = [];
  navs.push({name: '', label: '主页'});

  for(var k in collection) {
    navs.push({name: k, label: collection[k].option.label || k});
  }

  req.next = req.next || {};
  req.next.navs = navs;

  return next();
}

function listOne(req, res, next) {
  var collection = req.params.collection.upperFirst(),
    id = req.params.id;

  var u = req.query.u;

  var kvs = [];

  var schema = self.app.config[collection].schema;
  for(var item in schema) {
    kvs.push({k: item, v: schema[item].label});
  }

  var navs = req.next.navs;

  try {
    self.app.db[collection].findById(id).exec(function(err, doc) {
      return res.render('list', {kvs: kvs, navs: navs, active: collection, u: u, doc: doc, config: self.app.config[collection]});
    });
  } catch(e) {
    return res.json({recode: -1, msg: 'url error'});
  }
}

function listAll(req, res, next) {
  var collection = req.params.collection.upperFirst(),
    p = req.query.p || 0,
    s = req.query.s,
    q = req.query.q;

  var ns = s;
  if(s == 'id') ns = '_id';
  else if(s == '-id') ns = '-_id';

  var or = {};
  if(q) {
    or = self.app.config[collection].option.search.reduce(function(prev, item) {
      var t = {};
      t[item] = new RegExp(q, 'i');
      prev.push(t);

      return prev;
    }, []);
    or = {$or: or};
  }

  var kvs = [];

  var schema = self.app.config[collection].schema;
  for(var item in schema) {
    kvs.push({k: item, v: schema[item].label});
  }

  var navs = req.next.navs;

  try {
    async.parallel([
      function(cb) {
        self.app.db[collection].count(or).exec(function(err, cnt) {
          if(err) return cb(err);
          cb(null, cnt);
        });
      },
      function(cb) {
        var query = self.app.db[collection].find(or);

        if(ns) query.sort(ns);

        query.skip(p * per).limit(per);

        query.exec(function(err, docs) {
          if(err) return cb(err);
          return cb(null, docs);
        });
      }
    ], function(err, ret) {
      if(err) return res.json({recode: -1, msg: 'read db error'});

      var n = Array.apply(0, Array(Math.ceil(ret[0] / per))).map(function(item, index){
        return index;
      });

      return res.render('list', {navs: navs, active: collection, kvs: kvs, n: n, p: p, s: s, cnt: ret[0], collection: ret[1], config: self.app.config[collection]});
    });
  } catch(e) {
    return res.json({recode: -1, msg: 'url error'});
  }
}

function update(req, res, next) {
  var collection = req.params.collection.upperFirst(),
    id = req.params.id;

  var param = req.body;

  console.log(param);
  console.log(self.app.db.WorkSchema.path('title'));
  console.log(self.app.db.WorkSchema.path('like'));

  return res.json({recode: -1, msg: 'update db error'});

  // self.app.db[collection].findByIdAndUpdate(id, {$set: param}).exec(function(err) {
  //   if(err) return res.json({recode: -1, msg: 'update db error'});

  //   return res.redirect(u);
  // });
}

function remove(req, res, next) {
  var collection = req.params.collection.upperFirst(),
    id = req.params.id;

  self.app.db[collection].findByIdAndRemove(id).exec(function(err) {
    if(err) return res.json({recode: -1, msg: 'update db error'});

    return res.json({recode: 0});
  });
}

module.exports = function(app) {
  self.app = app;

  app.get('/', fill, index);

  app.get('/view/:collection/', fill, listAll);
  app.get('/view/:collection/:id/', fill, listOne);

  app.put('/view/:collection/:id/', update);

  app.delete('/view/:collection/:id/', remove);

  app.get('/chart/:collection/', chart);

}

function chart(req, res, next) {
  var collection = req.params.collection.upperFirst();

  function groupByDay(cond, cb, er) {
    if(arguments.length == 2) {
      er = cb;
      cb = cond;
      cond = undefined;
    }

    var option = {};

    option.map = function() {
      var date = [this.createDate.getFullYear(), this.createDate.getMonth() + 1, this.createDate.getDate()].join('-');
      emit(date, 1);
    };

    option.reduce = function(k, v) {
      return Array.sum(v);
    };

    if(cond) option.query = cond;

    self.app.db[collection].mapReduce(option, function(err, ret) {
      if(err) return er(err);
      return cb(ret);
    });
  }

  groupByDay(function(ret) {
    return res.json(ret);
  }, function(err) {
    console.log(err);
    return res.json();
  });

}