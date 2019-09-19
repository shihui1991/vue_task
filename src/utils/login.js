import Cookies from 'js-cookie'

const key_user_id = 'login_info_user_id';
const key_user_token = 'login_info_user_token';

export function getLoginUserId() {
  return Cookies.get(key_user_id)
}

export function getLoginUserToken() {
  return Cookies.get(key_user_token)
}

export function getLoginInfo() {
  return {
    user_id : Cookies.get(key_user_id),
    user_token : Cookies.get(key_user_token),
  }
}

export function setLoginInfo(userId,userToken) {
  Cookies.set(key_user_id, userId);
  Cookies.set(key_user_token, userToken);
  return true
}

export function removeLoginInfo() {
  Cookies.remove(key_user_id);
  Cookies.remove(key_user_token);
  return true;
}
