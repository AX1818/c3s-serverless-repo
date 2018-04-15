module.exports.clothResolver = {
  clothes: (args) => {
    console.log('id: ', args.id, ' tags: ', args.tags)
    return [
      {
        id: 1,
        name: "T-Shirt",
        category: "Leisure",
        price: 99.99
      }, {
        id: 2,
        name: "Pants",
        category: "Leisure",
        price: 88.88
      }
    ];
  }
};