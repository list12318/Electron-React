import React, { useState, useEffect } from "react";
import { useRoutes, Navigate, useNavigate } from "react-router-dom";

import { MinusOutlined, BorderOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";

import Login from "@/pages/login";
import ScreenShots from "@/pages/screenShots";
import FourNineRender from "@/pages/fournineRender";
import Config from "@/pages/config";
import Search from "@/pages/search";
import Result from "@/pages/result";

import useStore from "@/store";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import "./index.less";

const RouterElement = () => {
  const navigate = useNavigate();

  const { userStore, titleStore } = useStore(); //mobx
  const userInfo = toJS(userStore.userInfo);
  const titleShow = toJS(titleStore.show); //客户端标题栏是否显示

  const [routerList, setRouterList] = useState([
    {
      path: "/",
      element: <Navigate to={userInfo ? "/screenShots" : "/login"} />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/screenShots",
      element: <ScreenShots />,
    },
    {
      path: "/fournineRender",
      element: <FourNineRender />,
    },
    {
      path: "/config",
      element: <Config />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/result",
      element: <Result />,
    },
  ]);

  const backTo = () => {
    navigate(-1);
  };
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
          <p>千眼系统</p>
          <div className="tabbar-btn">
            <div className="titlebar-button" title="返回上一级" onClick={backTo}>
              <RollbackOutlined />
            </div>
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
