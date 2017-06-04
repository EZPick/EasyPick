module.exports = function (sequelize, DataTypes) {

  var Meeting = sequelize.define('Meeting', {
    title: { type: DataTypes.STRING, allowNull: false },
    closeoutTime: { type: DataTypes.DATE, allowNull: false},
    generalLocationLatitude: { type: DataTypes.DOUBLE, defaultValue: null, validate: { min: -90, max: 90 }}, // Location latitude - general meeting area
    generalLocationLongitude: { type: DataTypes.DOUBLE, defaultValue: null, validate: { min: -180, max: 180 }}, // Location longitude - general meeting area
    radius: { type: DataTypes.INTEGER, defaultValue: 1000, allowNull: false }, // Location Search Radius in meters
    duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 }, // Meeting durating - units in minutes -- default 1 hour
    invited: { type: DataTypes.JSON, defaultValue: "", allowNull: false }, // List of invited individuals (emails)
    creator: { type: DataTypes.STRING, defaultValue: "", allowNull: false }
  }, {
    classMethods: {
      associate: function (models) {
        Meeting.Decision = Meeting.hasOne(models.Decision);
        Meeting.Responses = Meeting.hasMany(models.Response);
      }
    }
  });

  return Meeting;
};
