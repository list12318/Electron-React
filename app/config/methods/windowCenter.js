// 监听React 发送的消息
const { ipcMain, screen } = require("electron");

const initSetWindowCenter = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-center", (event, size) => {
    mainWindow.center();
  });
};
module.exports = initSetWindowCenter;
