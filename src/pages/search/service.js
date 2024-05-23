import request from "@/request";

export function getMessageService(params) {
  return request({
    url: "/box/ai/analysis/res",
    method: "get",
    params,
  });
}

export function stopAnalysisRes() {
  return request({
    url: "/box/sys/cmd/stop",
    method: "get",
  });
}
