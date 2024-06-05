const { ipcMain, nativeImage } = require("electron");
const path = require("path");
const iconPath = path.join(__dirname, "../../libs/icon/logo.png");

const trayFlicker = (mainWindow) => {
  const tray = global.tray;
  let flashTimer = null;
  // 客户端触发事件
  ipcMain.on("tray-flicker", (event, data) => {
    const isFlash = data; //是否闪烁

    mainWindow.flashFrame(isFlash); //设置任务栏闪烁
    //设置系统托盘闪烁
    if (isFlash && !flashTimer) {
      clearInterval(flashTimer);
      flashTimer = null;

      let flag = false;
      flashTimer = setInterval(() => {
        flag = !flag;
        if (flag) {
          tray.setImage(nativeImage.createEmpty());
        } else {
          tray.setImage(iconPath);
        }
      }, 500);
    } else {
      tray.setImage(iconPath);
      clearInterval(flashTimer);
      flashTimer = null;
    }
  });
};
module.exports = trayFlicker;
