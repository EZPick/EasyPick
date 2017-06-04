module.exports = function (sequelize, DataTypes) {

  var Decision = sequelize.define('Decision', {
    address: DataTypes.STRING,
    nameOfLocation: DataTypes.STRING,
    dayOfWeek: DataTypes.INTEGER,
    minutesIn: DataTypes.INTEGER,
    canMake: DataTypes.JSON, // An array of response ids
    cantMake: DataTypes.JSON // An array of response ids
  }, {
    classMethods: {
      associate: function (models) {
        Decision.belongsTo(models.Meeting);
      }
    }
  });

  return Decision;
};
