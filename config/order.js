const order = {
  order: (order) => {
    switch (order) {
      case 'priceD':
        return [['price', 'DESC']];
      case 'priceA':
        return [['price', 'ASC']];
      default:
        return [['name', 'ASC']];
    }
  }
}


module.exports = order