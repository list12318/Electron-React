const { app, Tray, Menu } = require("electron");
const path = require("path");
// 创建托盘
const initTray = async (mainWindow) => {
  const tray = new Tray(path.join(__dirname, "../libs/icon/logo.png"));

  // 托盘右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "最大化",
      icon: path.join(__dirname, "../libs/icon/max.png"),
      click: function () {
        mainWindow.maximize();
      },
    },
    {
      label: "最小化",
      icon: path.join(__dirname, "../libs/icon/min.png"),
      click: function () {
        mainWindow.minimize();
      },
    },
    {
      label: "退出",
      icon: path.resolve(__dirname, "../libs/icon/out.png"),
      click: function () {
        app.isQuitting = true;
        app.quit();
        mainWindow = null; //清除窗口对象
      },
    },
  ]);

  tray.setToolTip("千眼系统");
  tray.setContextMenu(contextMenu);
  // 单击
  tray.on("click", function () {
    mainWindow.show();
  });
  // 双击
  tray.on("double-click", function () {
    mainWindow.show();
  });

  global.tray = tray; //将托盘实例挂载到全局变量
};

module.exports = initTray;
