module.exports = {
  devServer: {
    historyApiFallback: true,
    logLevel: "info",
    stats: {
      colors: true,
    },
    contentBase: "./example",
    port: 3000,
    host: "0.0.0.0",
    open: false,
    hot: true,
    inline: false,
    proxy: {
      "/box": {
        target: "http://10.10.2.162:80",
      },
      // "/api": {
      //   target: "http://10.10.200.181:38089",
      //   pathRewrite: {
      //     // "^/api": "",
      //   },
      //   // headers: {
      //   //     host: "172.27.128.147:40121",
      //   //     cookie: "User-Token=4a561f6e-71d5-4f3b-925f-b5f9afb18db7",
      //   // },
      // },
    },
  },
};
