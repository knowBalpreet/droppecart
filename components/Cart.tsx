import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  populateData,
  footerButtons,
  modes,
  getCartItems,
} from "../services/CartService";

import { RootState } from "../types";
import { ItemStatus } from "./Accordion";

/**
 * Discount Logic:
 * If product is present in 2 carts, discount = 20% on that product irrespective of quantity.
 * If product is present in 3 carts, discount = 30% on that product irrespective of quantity.
 * This means, num of presence in carts * 10%;
 */
type CartItems = {
  selected: string[];
  itemStatus: ItemStatus;
};

interface CartProps extends RootState {
  cartActions: any;
  cartItems: CartItems;
}

const Cart = ({
  carts,
  users,
  products,
  cartItems,
  cartActions,
}: CartProps) => {
  const [mode, setMode] = useState(modes[1]);

  const performAction = (type) => {
    let { itemStatus, selected } = cartItems;
    if (type === "approve") {
      selected.forEach((item) => {
        itemStatus[item] = "approved";
      });
    } else if (type === "disapprove") {
      selected.forEach((item) => {
        itemStatus[item] = "disapproved";
      });
    } else {
      return;
    }
    cartActions.setSelected([]);
    cartActions.setItemStatus({ ...itemStatus });
    setMode(modes[1]);
  };

  useEffect(() => {
    setMode(modes[0]);
  }, [cartItems.selected]);

  const [items, total] = populateData(
    mode === "selected"
      ? cartItems.selected
      : getCartItems(mode, cartItems.itemStatus),
    carts,
    users,
    products
  );

  return (
    <div className="flex flex-column w-40">
      <div
        className="flex flex-center gap-16"
        style={{
          paddingTop: 12,
        }}
      >
        {modes.map((_mode) => (
          <button
            key={_mode}
            onClick={() => setMode(_mode)}
            className="btn"
            style={{
              color: _mode === mode ? "white" : "black",
              backgroundColor: _mode === mode ? "black" : "white",
              border: `2px solid ${_mode === mode ? "green" : "black"}`,
            }}
          >
            {_mode}
          </button>
        ))}
      </div>
      <br />
      <div
        className="flex flex-column"
        style={{
          maxHeight: "50vh",
          minHeight: "30vh",
          overflowY: "scroll",
        }}
      >
        {_.isEmpty(items) ? (
          <div
            className="flex flex-align-center flex-center"
            style={{
              height: "100%",
            }}
          >
            <h3 className="text-capitalize">Empty Cart - {mode}</h3>
          </div>
        ) : (
          <>
            <table className="styled-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Product Name</th>
                  <th>Users</th>
                  <th className="text-right">Price</th>
                  <th style={{ width: "10%" }} className="text-right">
                    Qty
                  </th>
                  <th style={{ width: "20%" }} className="text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Selected section */}
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td
                      className="truncate"
                      style={{ textTransform: "capitalize" }}
                      title={item.fullName}
                    >
                      {item.fullName.map((name) => (
                        <span key={name}>
                          {name}
                          <br />
                        </span>
                      ))}
                    </td>
                    <td className="text-right">{item.price}</td>
                    <td className="text-right">
                      {item.quantity.map((qty) => (
                        <span key={qty}>
                          {qty}
                          <br />
                        </span>
                      ))}
                    </td>
                    <td className="text-right">
                      {item.quantity.length === 1 ? (
                        item.quantity[0] * item.price
                      ) : (
                        <>
                          {item.discountedPrice}
                          <span
                            style={{
                              color: "green",
                              marginTop: 4,
                              display: "block",
                            }}
                          >
                            {item.discountPercentage} off
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="flex flex-center gap-16"
              style={{
                marginTop: 16,
              }}
            >
              {footerButtons[mode].map((btn) => (
                <button
                  key={btn}
                  className="btn"
                  onClick={() => performAction(btn)}
                >
                  {`${btn} - ${total}$`}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
