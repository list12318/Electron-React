// 监听React 发送的消息
const { ipcMain, screen } = require("electron");

const initWindowTabbar = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-min", (event, size) => {
    mainWindow.minimize();
  });
  ipcMain.on("set-window-max", (event, size) => {
    // 检查窗口是否已经最大化
    if (mainWindow.isMaximized()) {
      // 如果已最大化，那么还原窗口
      mainWindow.unmaximize();
    } else {
      // 如果未最大化，那么最大化窗口
      mainWindow.maximize();
    }
  });
  ipcMain.on("set-window-close", (event, size) => {
    mainWindow.hide();
  });
};
module.exports = initWindowTabbar;
