import axios from "axios";
import { getSession } from "@/util";

const service = axios.create({
  baseURL: "",
  timeout: 50000, // 请求超时时间
});

/**
 * http request 拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 动态获取IP作为baseUrl
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === "development" || !getSession("ip")) {
      config.baseURL = "";
    } else {
      config.baseURL = getSession("ip");
    }
    // console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * http response 拦截器
 */
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 其他情况接口异常全部提示 请求错误
    // message.warning("请求错误,请稍后再试");
  }
);

export default service;
