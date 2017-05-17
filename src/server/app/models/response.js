module.exports = function (sequelize, DataTypes) {

  var Response = sequelize.define('Response', {
    responseId: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
    name: { type: Sequelize.STRING, allowNull: false }, // Responder Name
    email: { type: Sequelize.STRING, allowNull: false, }, // Responder Email
    schedule: { type: Sequelize.TEXT, allowNull: false }, // Stored as JSON?
    locationPreferences: { type: Sequelize.TEXT, allowNull: false }, // Stored as JSON?
    meetingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Meeting, // Reference model
        key: 'meetingId'// Foreign Key Column Name
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        Response.belongsTo(models.Meeting, {
          // This should remove all the responses for the meeting if the meeting is deleted
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Response;
};
