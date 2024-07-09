import React, { useState } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import { MinusOutlined, BorderOutlined, CloseOutlined } from "@ant-design/icons";

import Home from "@/pages/home";

import useStore from "@/store";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import "./index.less";

const RouterElement = () => {
  const { userStore, titleStore } = useStore(); //mobx
  const userInfo = toJS(userStore.userInfo);
  const titleShow = toJS(titleStore.show); //客户端标题栏是否显示

  const [routerList, setRouterList] = useState([
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ]);

  const minimize = () => {
    window.electronAPI.setWindowMin(); //修改窗口最小化
  };
  const maximize = () => {
    window.electronAPI.setWindowMax(); //修改窗口最大化
  };
  const closeWindow = () => {
    window.electronAPI.appQuit(); //修改窗口退出
  };

  return (
    <div className="electron-root">
      {titleShow && (
        <div className="electron-titlebar">
          <p>千眼视频智能分析系统</p>
          <div className="tabbar-btn">
            <div className="titlebar-button" title="最小化" onClick={minimize}>
              <MinusOutlined />
            </div>
            <div className="titlebar-button" title="最大化" onClick={maximize}>
              <BorderOutlined />
            </div>
            <div className="titlebar-button" title="关闭" onClick={closeWindow}>
              <CloseOutlined />
            </div>
          </div>
        </div>
      )}
      <div className="electron-content" style={{ height: titleShow ? "calc(100% - 35px)" : "100%" }}>
        {useRoutes(routerList)}
      </div>
    </div>
  );
};

export default observer(RouterElement);
