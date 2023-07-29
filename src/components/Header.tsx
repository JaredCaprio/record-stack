import React from "react";
import headerCSS from "./Header.module.css";

interface Props {
  title: String;
}

const Header: React.FC<Props> = ({ title }) => {
  return (
    <div className={headerCSS.headerWrapper}>
      <div className={headerCSS.header}>{title}</div>
    </div>
  );
};

export default Header;
