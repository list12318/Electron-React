const { app, ipcMain, screen } = require("electron");

const fullScreen = (mainWindow) => {
  // 客户端触发事件
  ipcMain.on("set-fullscreen", (event, data) => {
    const { width: fullWidth, height: fullHeight } = getSize();

    if (data) {
      // mainWindow.setResizable(true); //临时允许调整大小
      mainWindow.setSize(fullWidth, fullHeight);
      // mainWindow.setResizable(false);
      mainWindow.setKiosk(true);
    } else {
      mainWindow.setKiosk(false);
    }
  });
};

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
};

module.exports = fullScreen;
