module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    name: { type: DataTypes.STRING, allowNull: false }, // Responder Name
    email: { type: DataTypes.STRING, allowNull: false, }, // Responder Email
    schedule: { type: DataTypes.TEXT, allowNull: false }, // Stored as JSON?
    locationPreferences: { type: DataTypes.TEXT, allowNull: false } // Stored as JSOn
  }, {
    classMethods: {
      associate: function (models) {
        Response.belongsTo(models.Meeting);
      }
    }
  });

  return Response;
};
