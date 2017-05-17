var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'easypick'
    },
    port: process.env.PORT || 3001,
    db: 'mysql://root:123456@localhost/easypick-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'easypick'
    },
    port: process.env.PORT || 3001,
    db: 'mysql://root:123456@localhost/easypick-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'easypick'
    },
    port: process.env.PORT || 3001,
    db: 'mysql://root:123456@localhost/easypick-production'
  }
};

module.exports = config[env];
