import request from "@/request";

export function pageList(data) {
  return request({
    url: "/box/sys/status/alive",
    method: "get",
    data,
  });
}
// export function pageList(data) {
//   return request({
//     url: "/box/sys/status/alive",
//     method: "get",
//     data,
//   });
// }
