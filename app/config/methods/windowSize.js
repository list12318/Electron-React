// 监听React 发送的消息
const { ipcMain } = require("electron");

const initSetWindowSize = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-size", (event, size) => {
    const { width, height } = size;

    mainWindow.setSize(width, height);
  });
};
module.exports = initSetWindowSize;
