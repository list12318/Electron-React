const enName = "analysis";
const cnName = "千眼视频智能分析系统";
const config = {
  appId: enName, //应用程序唯一标识符
  productName: cnName, //应用程序名字
  directories: {
    output: "appDist", //输出目录
  },
  // files: ["dist/**/*", "preload.js", "main.js", "config/**/*", "libs/**/*"], //哪些需要打包
  files: ["**/*", "!**/node_modules/*", "!package-lock.json", "!appDist/**/*"], //除了!文件之外全部需要打包
  // libs 静态资源目录原封不动输出至appDist/resources
  // extraResources: [
  //   {
  //     from: "libs/",
  //     to: "libs/",
  //   },
  // ],
  // windows配置
  win: {
    // enName + "-setup-${version}.${ext}"
    artifactName: cnName + "-setup.${ext}", //文件名
    target: "nsis", //使用nsis作为安装器
    icon: "./libs/icon/logo.ico", //window状态栏图标以及窗口header图标
  },
  nsis: {
    oneClick: false, //是否一键安装
    allowElevation: true, //是否允许提升权限进行安装
    allowToChangeInstallationDirectory: true, //是否允许用户更改安装目录
    createDesktopShortcut: true, //是否创建桌面快捷方式
    createStartMenuShortcut: true, //是否创建开始菜单快捷方式
    runAfterFinish: true, //是否在完成安装后运行应用程序
    installerIcon: "./libs/icon/logo.ico", //安装程序图标，显示在控制面板中。
    uninstallerIcon: "./libs/icon/logo.ico", //卸载程序图标
    installerHeaderIcon: "./libs/icon/logo.ico", //安装程序窗口的标题栏图标
    shortcutName: cnName, //快捷方式名字
  },
  // linux配置
  linux: {
    artifactName: enName + "-${arch}" + ".${ext}", //安装包名
    target: [
      {
        target: "deb",
        arch: ["x64", "arm64"],
      },
    ],
    icon: "libs/icon/linux",
    category: "Science", //应用程序类别(科学和数学相关应用程序，例如数据分析工具、计算器、科学模拟软件等。)
  },
};

module.exports = config;
