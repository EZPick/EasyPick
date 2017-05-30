module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    name: { type: DataTypes.STRING, allowNull: false }, // Responder Name
    email: { type: DataTypes.STRING, allowNull: false, }, // Responder Email
    schedule: { type: DataTypes.JSON, allowNull: false },
    locationPreferences: { type: DataTypes.JSON, allowNull: false }
  }, {
    classMethods: {
      associate: function (models) {
        Response.belongsTo(models.Meeting);
      }
    }
  });

  return Response;
};
