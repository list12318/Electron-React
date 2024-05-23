import React from "react";
import userStore from "./user";
import titleStore from "./titleBar";

const store = React.createContext({
  userStore: new userStore(),
  titleStore: new titleStore(),
});

export default () => React.useContext(store);
