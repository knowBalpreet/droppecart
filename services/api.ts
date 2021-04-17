import _ from "lodash";

const baseURL = "https://fakestoreapi.com",
  userIds = _.range(1, 6);

const fetchCarts = async () => {
  try {
    const response = await Promise.all(
      userIds.map((userId) =>
        fetch(`${baseURL}/carts/user/${userId}`).then((res) => res.json())
      )
    );
    return [_.uniqBy(_.flatten(response), "userId"), null];
  } catch (e) {
    return [null, e];
  }
};

const fetchUsers = async () => {
  try {
    const response = await Promise.all(
      userIds.map((userId) =>
        fetch(`${baseURL}/users/${userId}`).then((res) => res.json())
      )
    );
    return [_.keyBy(response, "id"), null];
  } catch (e) {
    return [null, e];
  }
};

const fetchProducts = async (productIds) => {
  try {
    const response = await Promise.all(
      productIds.map((productId) =>
        fetch(`${baseURL}/products/${productId}`).then((res) => res.json())
      )
    );
    return [_.keyBy(response, "id"), null];
  } catch (e) {
    return [null, e];
  }
};

const updateCart = (cartDetails) => {
  return Promise.resolve(cartDetails);
};

export { fetchCarts, fetchUsers, fetchProducts, updateCart };
