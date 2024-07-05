'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BorrowedBooks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BorrowedBooks.belongsTo(models.Member, { foreignKey: 'memberCode' });
      BorrowedBooks.belongsTo(models.Book, { foreignKey: 'bookCode' });
    }
  }
  BorrowedBooks.init({
    memberCode: {
      type: DataTypes.STRING,
      references: {
        model: 'Members',
       
      }
    },
    bookCode: {
      type: DataTypes.STRING,
      references: {
        model: 'Books', 
      }
    },
    borrowedAt: DataTypes.DATE,
    returnedAt: DataTypes.DATE,
    maxReturnAt: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BorrowedBooks',
    timestamps: true // Adds createdAt and updatedAt fields
  });
  return BorrowedBooks;
};
