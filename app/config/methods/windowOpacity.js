// 监听React 发送的消息
const { ipcMain } = require("electron");

const initSetWindowOpacity = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-opacity", (event, size) => {
    const { opacity } = size;

    mainWindow.setOpacity(opacity);
  });
};
module.exports = initSetWindowOpacity;
