// 监听React 发送的消息
const { ipcMain, screen } = require("electron");

const initWindowTabbar = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-min", (event, size) => {
    mainWindow.setResizable(true); //临时允许调整大小,由于设置了 resizable: false
    mainWindow.minimize();
    mainWindow.setResizable(false);
  });
  ipcMain.on("set-window-max", (event, size) => {
    mainWindow.setResizable(true); //临时允许调整大小,由于设置了 resizable: false

    // 检查窗口是否已经最大化
    if (mainWindow.isMaximized()) {
      // 如果已最大化，那么还原窗口
      mainWindow.unmaximize();
    } else {
      // 如果未最大化，那么最大化窗口
      mainWindow.maximize();
    }
    mainWindow.setResizable(false);
  });
  ipcMain.on("set-window-close", (event, size) => {
    mainWindow.hide();
  });
};
module.exports = initWindowTabbar;
