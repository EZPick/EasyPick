var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  production: {
    root: rootPath,
    app: {
      name: 'easypick'
    },
    port: process.env.PORT,
    db: process.env.DATABASE_URL
  }
};

module.exports = config[env];

