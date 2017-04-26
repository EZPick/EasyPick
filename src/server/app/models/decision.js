module.exports = function (sequelize, DataTypes) {

  var Decision = sequelize.define('Decision', {
    address: DataTypes.STRING,
    nameOfLocation: DataTypes.STRING,
    dayOfWeek: DataTypes.STRING,
    timeOfDay: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
      }
    }
  });

  return Decision;
};
