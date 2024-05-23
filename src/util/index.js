/*
 * @Author: 李永健
 * @Date: 2022-09-05 11:10:36
 * @LastEditors: 李永健
 * @LastEditTime: 2023-03-07 17:34:16
 * @Description: 全局通用方法
 */

// 生成唯一uuid,len为长度，radix为进制，例如(8,10)即长度为8,10进制的uuid
export function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

// 操作sessionStorage
export const getSession = (key) => {
  return window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null;
};
export const setSession = (data) => {
  const { key, value } = data;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};
export const clearSession = (key) => {
  window.sessionStorage.removeItem(key);
};

// 剔除obj中值为null和undefined
export const deleteObjEmpty = (obj) => {
  const params = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
  return params;
};
