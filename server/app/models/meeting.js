module.exports = function (sequelize, DataTypes) {

  var Meeting = sequelize.define('Meeting', {
    title: { type: DataTypes.STRING, allowNull: false },
    // In practice, we never want to keep a meeting with no code.
    // But in order to give it a unique id (which is used as the end of the
    // code to guarantee uniqueness), we need to make it without one first.
    code: { type: DataTypes.STRING, allowNull: true },
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
