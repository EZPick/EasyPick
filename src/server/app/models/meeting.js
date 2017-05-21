module.exports = function (sequelize, DataTypes) {

  var Meeting = sequelize.define('Meeting', {
    title: { type: DataTypes.STRING, allowNull: false },
    closeoutDate: { type: DataTypes.DATE, allowNull: false},
    closeoutTime: { type: DataTypes.TIME, allowNull: false},
    generalLocation: { type: DataTypes.STRING, defaultValue: "", allowNull: false }, //  general location
    latitude: { type: DataTypes.INTEGER, defaultValue: null, validate: { min: -90, max: 90 }}, // Location latitude
    longitude: { type: DataTypes.INTEGER, defaultValue: null, validate: { min: -180, max: 180 }}, // Location longitude
    radius: { type: DataTypes.INTEGER, defaultValue: 1000, allowNull: false }, // Location Search Radius in meters
    duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
    invited: { type: DataTypes.JSON, defaultValue: "", allowNull: false },
    creator: { type: DataTypes.STRING, defaultValue: "", allowNull: false } // Default value is one hour -- units in minutes
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
