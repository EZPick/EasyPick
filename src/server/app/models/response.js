module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    schedule: DataTypes.TEXT, // Stored as JSON?
    locationPreferences: DataTypes.TEXT // Stored as JSON?
  }, {
    classMethods: {
      associate: function (models) {
        Response.belongsTo(models.Meeting);
      }
    }
  });

  return Response;
};
