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
  },

  BOOK_ORDER: (order) => {
    switch (order) {
      case 'priceD':
        return 7;
      case 'priceA':
        return 8;
      default:
        return 1;
    }
  },

  SHOPEE_ORDER: (order) => {
    switch (order) {
      case 'priceD':
        return ['price', 'desc'];
      case 'priceA':
        return ['price', 'asc'];
      default:
        return ['relevancy', 'desc'];
    }
  },

  CITE_ORDER: (order) => {
    switch (order) {
      case 'priceD':
        return 3;
      case 'priceA':
        return 2;
      default:
        return "";
    }
  }
}


module.exports = order