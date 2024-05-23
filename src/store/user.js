import { makeAutoObservable } from "mobx";
import { getSession, setSession, clearSession } from "@/util";

class LoginStore {
  constructor() {
    makeAutoObservable(this);
  }

  userInfo = getSession("userInfo"); //获取用户信息

  // 登录
  login(value) {
    this.userInfo = value; //存储到mobx
    setSession({ key: "userInfo", value }); //存储到session
  }
}

export default LoginStore;
