module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    srchTerm: {
      type: DataTypes.STRING
    },
    srchLocation: {
      type: DataTypes.STRING
    },
    srchCategory: {
      type: DataTypes.STRING
    }
  });

  Activity.associate = function(models) {
    Activity.belongsTo(models.User, {foreignKey: 'userName', targetKey: 'username'});
  };

  return Activity;
};
