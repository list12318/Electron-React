// 监听React 发送的消息
const { ipcMain } = require("electron");

const setWindowTop = (mainWindow) => {
  ipcMain.on("set-window-top", (event, isTop) => {
    mainWindow.setAlwaysOnTop(isTop);
  });
};
module.exports = setWindowTop;
