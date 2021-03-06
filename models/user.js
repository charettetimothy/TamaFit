// for password hashing
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [6, 320]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 26]
      }
    },
    imgUrl: {
      type: DataTypes.STRING
    }
  });

  User.associate = function(models) {
    // When a User is deleted, also delete any associated Logs
    User.hasMany(models.Log, {
      onDelete: "cascade"
    });
  };

  // compare unhashed password entry to the hashed password stored in our database for login
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  // password is automatically hashed before a User is created
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
