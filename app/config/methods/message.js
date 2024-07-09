const { ipcMain, Notification } = require("electron");

const initWindowMessage = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("show-window-message", (event, data) => {
    const { title, subTitle } = data;

    new Notification(title, {
      body: subTitle,
    }).show();
  });
};
module.exports = initWindowMessage;
