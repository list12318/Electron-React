const { app, ipcMain, screen, desktopCapturer } = require("electron");

const getScreenShots = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("get-screenShots", async (event, gridSize) => {
    const sizeInfo = getSize();
    desktopCapturer
      .getSources({
        types: ["window", "screen"], // 设定需要捕获的是"屏幕"，还是"窗口"
        thumbnailSize: sizeInfo,
      })
      .then(async (sources) => {
        //获取第一个屏幕
        let imageData = sources[0].thumbnail.toDataURL("image/png");

        mainWindow.webContents.send("callback-shots", {
          imageData,
          sizeInfo,
          gridSize,
        });
      });
  });
};

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  // console.log(1, screen.getPrimaryDisplay(), size, scaleFactor);
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
    scaleFactor,
  };
};

module.exports = getScreenShots;
