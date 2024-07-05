'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Member.hasMany(models.BorrowedBooks, { foreignKey: 'memberCode', sourceKey: 'code', as: 'BorrowedBooks' });
    }
  }
  Member.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    penaltyTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};