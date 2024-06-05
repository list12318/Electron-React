// 监听React 发送的消息
const { ipcMain } = require("electron");

const initWindowShow = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-show", (event, isShow) => {
    if (isShow && isShow === true) {
      mainWindow.show();
    }
    if (isShow === false) {
      mainWindow.hide();
    }
  });
};
module.exports = initWindowShow;
