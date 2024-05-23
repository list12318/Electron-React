import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import menuList from "@/route/menu";
import "./index.less";

const LeftBar = (props) => {
  const {
    location: { pathname: path },
    collapsed,
    setCollapsed,
  } = props;
  let openKey = [];

  // 菜单渲染
  const getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push(
          <Menu.Item key={item.path} icon={item.icon ? item.icon : null}>
            <Link to={item.path}>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find((v) => path.indexOf(v.path) === 0);
        // 由于初始化时leftBar比content加载快，content内部的重定向还没执行，故拿到的path为"/"
        if (path === "/") openKey = [...openKey, "/textRecognition"];
        // 如果存在, 说明当前item的子列表需要打开
        if (cItem) openKey = [...openKey, item.path];

        // 向pre添加<SubMenu>
        pre.push(
          <Menu.SubMenu key={item.path} icon={item.icon ? item.icon : null} title={item.title}>
            {getMenuNodes(item.children)}
          </Menu.SubMenu>
        );
      }

      return pre;
    }, []);
  };

  const menuTreeNode = getMenuNodes(menuList);

  const handleMenuSelect = () => {};

  return (
    <div className="left_bar">
      <div className="left_bar_scroll">
        {menuTreeNode.map((item, index) => (
          <Menu
            key={item.key}
            mode="inline"
            theme="dark"
            onSelect={handleMenuSelect}
            selectedKeys={[path]}
            defaultOpenKeys={openKey}
          >
            {item}
          </Menu>
        ))}
      </div>
      <div className="collapsed">
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
        )}
      </div>
    </div>
  );
};

export default withRouter(LeftBar);
