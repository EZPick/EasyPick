var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  test: {
    root: rootPath,
    app: {
      name: 'easypick'
    },
    port: process.env.PORT || 3001,
    db: 'postgres://postgres@localhost/easypick-test'
  }
};

module.exports = config[env];
