import request from "@/request";

export function getMessageList(params) {
  return request({
    url: "/box/ai/analysis/res",
    method: "get",
    params,
  });
}
