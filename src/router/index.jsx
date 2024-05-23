import React, { useState, useEffect } from "react";
import { useRoutes, Navigate, useNavigate } from "react-router-dom";

import { MinusOutlined, BorderOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { organizeMenuList } from "@/util/route";
import Login from "@/pages/login";
import ScreenShots from "@/pages/screenShots";
import Config from "@/pages/config";
import Search from "@/pages/search";
import Result from "@/pages/result";

import { routerData } from "./route";
import useStore from "@/store";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import "./index.less";

const RouterElement = () => {
  const navigate = useNavigate();

  const { userStore, titleStore } = useStore(); //mobx
  const userInfo = toJS(userStore.userInfo);
  const titleShow = toJS(titleStore.show); //客户端标题栏是否显示

  const menuList = routerData;

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

  useEffect(() => {
    console.log("window----", window);
    if (menuList.length) {
      let newRouterList = organizeMenuList(menuList);

      setRouterList((data) => {
        return [...data, ...newRouterList];
      });
    }
  }, [menuList]);

  const backTo = () => {
    navigate(-1);
  };
  const minimize = () => {
    window.electronAPI.setWindowMin(); //修改窗口最小化
  };
  const maximize = () => {
    window.electronAPI.setWindowMax(); //修改窗口最小化
  };
  const closeWindow = () => {
    window.electronAPI.setWindowClose(); //修改窗口最小化
  };

  return (
    <div className="electron-root">
      {titleShow && (
        <div className="electron-titlebar">
          <p>边缘计算客户端</p>
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
