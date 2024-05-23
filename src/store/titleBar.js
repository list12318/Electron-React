import { makeAutoObservable } from "mobx";
import { getSession, setSession, clearSession } from "@/util";

class TitleStore {
  constructor() {
    makeAutoObservable(this);
  }

  show = true; //获取用户信息

  // 登录
  setShow(value) {
    this.show = value; //存储到mobx
  }
}

export default TitleStore;
