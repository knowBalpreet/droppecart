import React from "react";

const statuses = {
  approved: {
    title: "Approved - Click to toggle",
    symbol: "&#x2713;",
  },
  disapproved: {
    title: "Disapproved - Click to toggle",
    symbol: "&#xd7;",
  },
  undecided: {
    title: "Undecided - Click to toggle",
    symbol: "&#x26A0;",
  },
};

const ToggleStatus = ({ status }) => {
  return (
    <span
      className="flex flex-center cursor-pointer"
      style={{
        width: 20,
        height: 20,
      }}
      title={statuses[status].title}
      dangerouslySetInnerHTML={{ __html: statuses[status].symbol }}
    />
  );
};
export default ToggleStatus;
