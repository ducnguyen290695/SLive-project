/**
 * @description all action of user-banned page
 */
import {
  GET_ALL_USER_WALLETS,
  GET_ALL_USER_WALLETS_FAILED,
  GET_ALL_USER_WALLETS_SUCCESS,
  RESET_ALL,
} from '@/src/redux/user_wallet/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllUserWalletAct(body) {
  return {
    type: GET_ALL_USER_WALLETS,
    body,
  };
}

export function getAllUserWalletSuccess(data) {
  return {
    type: GET_ALL_USER_WALLETS_SUCCESS,
    data,
  };
}

export function getAllUserWalletFailed(error) {
  return {
    type: GET_ALL_USER_WALLETS_FAILED,
    error,
  };
}
