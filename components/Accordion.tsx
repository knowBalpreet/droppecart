import React, { useState, useEffect } from "react";
import cx from "classnames";
import _ from "lodash";
import { transformData } from "../services/AccordionService";
import Cart from "./Cart";
import ToggleStatus from "./ToggleStatus";
import { AccordianProps, TransformData } from "../types";
import { updateCart } from "../services/api";

export interface ItemStatus {
  [key: string]: string;
}

const Accordion = ({ carts, users, products, currentView }: AccordianProps) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([0]);
  const [selected, setSelected] = useState<string[]>([]);

  const [itemStatus, setItemStatus] = useState<ItemStatus>({});

  const data: TransformData[] = transformData({
    carts,
    users,
    products,
    currentView,
  });

  useEffect(() => {
    setActiveIndex([0]);
    setSelected([]);
  }, [currentView]);

  useEffect(() => {
    // Pseudo function for updating cart, we do not have an api to support this yet,
    // but this is where I will update
    updateCart(itemStatus);
  }, [itemStatus]);

  const toggleSelected = (selectedId) => {
    let newSelected;
    if (selected.includes(selectedId)) {
      newSelected = selected.filter((idx) => idx !== selectedId);
    } else {
      newSelected = [...selected, selectedId];
    }
    setSelected(newSelected);
  };

  const toggleIndex = (index) => {
    let newIndex;
    if (activeIndex.includes(index)) {
      newIndex = activeIndex.filter((idx) => idx !== index);
    } else {
      newIndex = [...activeIndex, index];
    }
    setActiveIndex(newIndex);
  };

  const changeStatus = (id) => {
    if (id in itemStatus) {
      if (itemStatus[id] === "approved") {
        itemStatus[id] = "disapproved";
      } else {
        delete itemStatus[id];
      }
    } else {
      itemStatus[id] = "approved";
    }
    setItemStatus({ ...itemStatus });
  };

  return (
    <div className="accordion-container">
      <div className="flex flex-between gap-16">
        {/* Accordion Section */}
        <div className="w-60">
          {data.map(({ label, children }, index) => (
            <div key={index}>
              <button
                className={cx("accordion flex flex-between", {
                  active: activeIndex.includes(index),
                })}
                onClick={() => toggleIndex(index)}
              >
                <div className="flex flex-align-center gap-8 text-capitalize">
                  {label.img && (
                    <img
                      width="30px"
                      height="30px"
                      className="img-contain"
                      src={label.img}
                      alt=""
                    />
                  )}
                  {label.title}
                </div>
                <div>{label.cost} $</div>
              </button>
              {activeIndex.includes(index) && (
                <div className="panel" style={{ padding: "0 2rem" }}>
                  {children.map((item, id) => (
                    <div
                      key={id}
                      className="flex flex-between"
                      style={{
                        padding: "4px 0",
                      }}
                    >
                      <div
                        className="flex flex-align-center gap-8"
                        style={{
                          maxWidth: "50%",
                        }}
                      >
                        <div onClick={() => changeStatus(item.id)}>
                          {item.id in itemStatus ? (
                            <ToggleStatus status={itemStatus[item.id]} />
                          ) : (
                            <ToggleStatus status="undecided" />
                          )}
                        </div>
                        <label className="flex flex-align-center cursor-pointer gap-8">
                          <input
                            type="checkbox"
                            onChange={() => toggleSelected(item.id)}
                            checked={selected.includes(item.id)}
                          />

                          {item.img && (
                            <img
                              width="32px"
                              height="32px"
                              className="img-contain"
                              src={item.img}
                              alt=""
                            />
                          )}
                          <div style={{ textTransform: "capitalize" }}>
                            {item.title}
                          </div>
                        </label>
                      </div>

                      <div className="flex flex-between">
                        <span>
                          {item.price}$ * {item.quantity}
                        </span>
                        <span> = {item.total}$</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <Cart
          carts={carts}
          products={products}
          users={users}
          cartItems={{ selected, itemStatus }}
          cartActions={{
            setSelected,
            setItemStatus,
          }}
        />
      </div>
    </div>
  );
};

export default Accordion;
