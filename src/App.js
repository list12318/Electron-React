import React from "react";
import { message } from "antd";
//导入路由组件
import { HashRouter } from "react-router-dom";

import RouterElement from "@/router";

import "./App.css";

// 设置message组件提示距离顶部为50px
message.config({
  top: 50,
});

const App = () => {
  return (
    <HashRouter>
      <RouterElement></RouterElement>
    </HashRouter>
  );
};

export default App;
