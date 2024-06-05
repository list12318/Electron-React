import request from "@/request";

export function setBox(data) {
  return request({
    url: "/box/region/crop/set",
    method: "POST",
    data,
  });
}
