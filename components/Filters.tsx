import React from "react";
import ToggleView from "./ToggleView";

export type FilterProps = {
  currentView: string;
  toggle: () => void;
};

const Filters = ({ currentView, toggle }: FilterProps) => {
  return (
    <div className="flex flex-between">
      <h1>Droppe Cart</h1>
      <ToggleView currentView={currentView} toggle={toggle} />
    </div>
  );
};

export default Filters;
