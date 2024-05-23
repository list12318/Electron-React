import React, { useRef, useState } from "react";
import { Layout, Modal, Popover } from "antd";
import { CameraOutlined, ExportOutlined, UserOutlined, UnlockOutlined } from "@ant-design/icons";
const { Header } = Layout;
import "./index.less";
import UserInfo from "@/pages/userInfo?";
import ModifyPassword from "@/pages/modifyPassword";
import CameraManger from "@/pages/cameraManger";
import useStore from "@/store";
import { toJS } from "mobx";
import { observer } from "mobx-react";

const headerBar = (props) => {
  const { LoginStore } = useStore(); //mobx
  const userInfo = toJS(LoginStore.userInfo);
  console.log(1111, userInfo);

  const userInfoRef = useRef();
  const modifyPasswordRef = useRef();
  const cameraMangerRef = useRef();

  // 退出登录
  const logout = () => {
    Modal.confirm({
      title: "退出",
      content: "确定要退出系统吗?",
      okText: "确定退出",
      cancelText: "取消",
      okButtonProps: {
        danger: true,
      },
      onOk: () => {
        LoginStore.logout();
      },
    });
  };

  // 静态dom
  const accountContent = (
    <div className="profile_bottom">
      <ul className="profile_border_bottom">
        <li onClick={() => userInfoRef.current.getPage()}>
          <UserOutlined />
          个人中心
        </li>
        <li onClick={() => modifyPasswordRef.current.getPage()}>
          <UnlockOutlined />
          修改密码
        </li>
        <li onClick={() => cameraMangerRef.current.getPage()}>
          <CameraOutlined />
          摄像头管理
        </li>
        <li className="logout">
          <div className="logout_content" onClick={logout}>
            <ExportOutlined />
            退出登录
          </div>
        </li>
      </ul>
    </div>
  );
  return (
    <>
      <Header>
        <div className="header_left">
          <img src={require("@/assets/img/header-logo.png")} alt="" />
          <p className="header_left_title">边缘计算客户端</p>
        </div>
        <div className="header_right">
          <div className="user_box">
            <Popover placement="bottom" title={null} content={accountContent} trigger="hover" getPopupContainer={(triggerNode) => triggerNode}>
              <div className="user_picture">
                <img className="small_head_port" src={userInfo.userPicture} alt="" />
              </div>
            </Popover>
            <p className="user_name">
              <marquee behavior="scroll" scrollamount="2" direction="left" align="middle">
                {"欢迎登录，" + userInfo?.username}
              </marquee>
            </p>
          </div>
        </div>
      </Header>
      {/* 个人信息 */}
      <UserInfo ref={userInfoRef} />
      {/* 修改密码 */}
      <ModifyPassword ref={modifyPasswordRef} />
      {/* 摄像头管理 */}
      <CameraManger ref={cameraMangerRef} />
    </>
  );
};

export default observer(headerBar);
