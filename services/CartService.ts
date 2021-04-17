import _ from "lodash";

const modes = ["selected", "approved", "disapproved"],
  footerButtons = {
    selected: ["approve", "disapprove", "clear"],
    approved: ["checkout"],
    disapproved: [],
  };

const getCartItems = (mode, status) => {
  let items = [];
  _.forIn(status, (value, key) => {
    if (value === mode) {
      items.push(key);
    }
  });
  return items;
};

const productGroupedItems = (items) => {
  let finalItems = [],
    finalPrice = 0;
  _.forEach(_.groupBy(items, "productId"), (value, key) => {
    if (value.length === 1) {
      finalItems.push(value[0]);
      finalPrice += value[0].price * value[0].quantity[0];
    } else {
      let item = _.reduce(
        value,
        (result, v, k) => {
          if (_.isEmpty(result)) {
            result = v;
          } else {
            result["quantity"].push(v["quantity"]);
            result["fullName"].push(v["fullName"]);
          }
          return result;
        },
        {}
      );
      let discountedPrice = _.round(
        _.sum(item.quantity) * item.price * (1 - 0.1 * item.quantity.length),
        2
      );
      finalPrice += discountedPrice;
      item = {
        ...item,
        finalPrice,
        discountedPrice,
        discountPercentage: `${item.quantity.length * 10}%`,
      };
      finalItems.push(item);
    }
  });
  return [finalItems, _.round(finalPrice, 2)];
};

const populateData = (items, carts, users, products) => {
  return productGroupedItems(
    items.map((item) => {
      let [userId, productId] = item.split(":").map(Number);
      let fullName = `${users[userId].name.firstname} ${users[userId].name.lastname}`;
      let cart = _.find(carts, { userId });
      let { quantity } = _.find(cart.products, { productId });
      let { title, price } = products[productId];
      return {
        userId,
        productId,
        id: item,
        fullName: [fullName],
        quantity: [quantity],
        title,
        price,
      };
    })
  );
};

export { modes, populateData, footerButtons, getCartItems };
