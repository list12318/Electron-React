const { app, ipcMain } = require("electron");

const appQuit = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("app-quit", (event, data) => {
    if (process.platform !== "darwin") {
      // 如果不是 macOS 系统，直接退出应用程序
      app.quit();
    } else {
      // 如果是 macOS 系统，隐藏窗口，不退出应用程序
      mainWindow.preventDefault();
      mainWindow.hide();
    }
  });
};
module.exports = appQuit;
