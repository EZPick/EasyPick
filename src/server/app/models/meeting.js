module.exports = function (sequelize, DataTypes) {

  var Meeting = sequelize.define('Meeting', {
    title: DataTypes.STRING,
    closeoutTime: DataTypes.DATE,
    generalLocation: DataTypes.STRING,
    duration: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        Meeting.hasOne(models.Decision);
      }
    }
  });

  return Meeting;
};
