import React from "react";

export const Nav = ({account}) => {
  return (
    <div className="flex bg-[#577BC1] text-white font-semibold w-100 h-24 shadow-lg px-8">
      <div className="flex flex-row items-center mr-auto">
        <p>IMG ERC721</p>
      </div>
      <div className="flex flex-row items-center">
        <p>{account}</p>
      </div>
    </div>
  );
};
