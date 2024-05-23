import request from "@/request";
import { getSession } from "@/util";

// 查询默认配置
export function getConfigService() {
  return request({
    url: "/box/ai/face/cnf",
    method: "get",
  });
}
//人脸布控上传file
export function uploadUser(data) {
  return request({
    url: "/box/biz/person/add",
    method: "post",
    data,
  });
}
// 配置保存
export function setAlgorithmService(data) {
  return request({
    url: "/box/ai/face/cnf",
    method: "post",
    data,
  });
}
// 开始分析
export function startAnalysisRes() {
  return request({
    url: "/box/sys/cmd/start",
    method: "get",
  });
}
