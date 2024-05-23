import request from "@/request";

export function login(data) {
  return request({
    url: "/box/sys/status/alive",
    method: "get",
    data,
  });
}
