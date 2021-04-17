import React from "react";
import { FilterProps } from "./Filters";

const ToggleView = ({ currentView, toggle }: FilterProps) => {
  const checked = currentView === "products";
  return (
    <div className="toggle">
      <p>{checked ? "Product View" : "User View"}</p>
      <label className="switch">
        <input type="checkbox" onChange={toggle} checked={checked} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleView;
