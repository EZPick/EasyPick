module.exports = function (sequelize, DataTypes) {

  var Meeting = sequelize.define('Meeting', {
    meetingId: { type: sequelize.INTEGER, primaryKey: true, autoIncremnt: true }, // Meeting Identifier
    title: { type: sequelize.STRING, allowNull: false }, // Title of the meeting
    closeoutTime: { type: sequelize.DATE, allowNull: false, defaultValue: sequelize.NOW }, // Response closeout time
    generalLocation: { type: sequelize.STRING, defaultValue: "", allowNull: false }, //  general location
    latitude: { type: sequelize.INTEGER, defaultValue: null, validate: { min: -90, max: 90 }}, // Location latitude
    longitude: { type: sequelize.INTEGER, defaultValue: null, validate: { min: -180, max: 180 }}, // Location longitude
    radius: { type: sequelize.INTEGER, defaultValue: 1000, allowNull: false } // Location Search Radius in meters
    duration: { type: sequelize.INTEGER, allowNull: false, defaultValue: 60 } // Meeting Duration in minutes (default 1 hour)
  }, {
    validate: {
      bothCoordsOrNone() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither')
        }
      }
  }, {
    classMethods: {
      associate: function (models) {
        Meeting.hasOne(models.Decision);
        Meeting.hasMany(models.Response);
      }
    }
  });

  return Meeting;
};
