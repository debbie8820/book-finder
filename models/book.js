'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.hasMany(models.Like)
      Book.belongsTo(models.Store)
    }
  };
  Book.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    img: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    author: DataTypes.STRING,
    productNumber: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    StoreId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};