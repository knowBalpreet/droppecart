import { AccordianProps, User } from "../types";
import _ from "lodash";

const calculateCartCost = (cartProducts, products) => {
  let cost = 0;
  cartProducts.forEach(({ productId, quantity }) => {
    cost += products[productId].price * quantity;
  });
  return cost;
};

const calculateProductCost = (productId, carts, products) => {
  let cost = 0;

  carts.forEach((cart) => {
    let product = _.find(cart.products, { productId });
    if (product) {
      cost += products[productId].price * product.quantity;
    }
  });
  return cost;
};

const getProductUsers = (users, carts, products, product) => {
  let productUsers = [];
  Object.values(users).forEach((user: User) => {
    // users that have the current product in their cart
    let cart = _.find(carts, { userId: user.id });
    if (cart) {
      let _product = _.find(cart.products, { productId: product.id });
      console.log("_product :", _product);
      if (_product) {
        productUsers.push({
          id: `${user.id}:${_product.productId}`,
          img: null,
          title: `${user.name.firstname} ${user.name.lastname}`,
          quantity: _product.quantity,
          price: products[product.id].price,
          total: products[product.id].price * _product.quantity,
        });
      }
    }
  });
  return productUsers;
};

const transformData = ({
  carts,
  users,
  products,
  currentView,
}: AccordianProps) => {
  if (currentView === "users") {
    let data = carts.map((cart) => ({
      label: {
        img: null,
        title: `${users[cart.userId].name.firstname} ${
          users[cart.userId].name.lastname
        }`,
        cost: calculateCartCost(cart.products, products),
      },
      children: cart.products.map(({ productId, quantity }) => ({
        img: products[productId].image,
        title: products[productId].title,
        quantity,
        price: products[productId].price,
        total: products[productId].price * quantity,
        id: `${cart.userId}:${productId}`,
      })),
    }));
    return data;
  } else if (currentView === "products") {
    let data = Object.values(products).map((product) => ({
      label: {
        img: product.image,
        title: product.title,
        cost: calculateProductCost(product.id, carts, products),
      },
      children: getProductUsers(users, carts, products, product),
    }));
    return data;
  }
};

export { transformData };
