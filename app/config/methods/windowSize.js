// 监听React 发送的消息
const { ipcMain } = require("electron");

const initSetWindowSize = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-window-size", (event, size) => {
    const { width, height } = size;

    // mainWindow.setResizable(true); //临时允许调整大小,由于设置了 resizable: false 也等同于setSize方法失效
    mainWindow.unmaximize(); //如果最大化了，先退出最大化，否则无法设置size
    mainWindow.setSize(width, height);
    // mainWindow.setResizable(false);
  });
};
module.exports = initSetWindowSize;
