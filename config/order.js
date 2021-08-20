const Sequelize = require('sequelize')

const order = {
  order: (order, keyword) => {
    switch (order) {
      case 'priceD':
        return [['price', 'DESC']];
      case 'priceA':
        return [['price', 'ASC']];
      default:
        return [[
          Sequelize.literal(`
          CASE 
          WHEN book.name LIKE '${keyword}%' THEN 1
          WHEN book.name LIKE '%${keyword}' THEN 3
          ELSE 2
          END`, order)
        ]];
    }
  }
}


module.exports = order