import queryString from 'query-string';
import Router from 'next/router';
import jwt_decode from 'jwt-decode';
import { intersection } from 'lodash';

export const formatPhonenumber = (phoneNumber: string) => {
  if (phoneNumber && phoneNumber.length === 12) {
    return phoneNumber.slice(1, 12);
  }
  return '';
};

export const formatNumber = number => {
  return Math.round(number);
};

export const disabledDatePicker = current => {
  return current && current.valueOf() > Date.now();
};

export const buildQueryString = ({ rootUrl, params }) => {
  let query = `${rootUrl}?`;
  for (const [key, value] of Object.entries(params)) {
    query += `${key}=${value}&`;
  }
  query = query.slice(0, -1);
  Router.replace(query);
  const parsed = queryString.parse(location.search);
  return { parsed };
};

export const getExp = token => {
  const decoded = jwt_decode(token);
  const d = new Date();
  const expire = ((decoded as any).exp - d.getTime() / 1000 + 7 * 3600) / (24 * 3600);
  return expire;
};

export const checkRoles = ({ userRoles, permittedRoles }) => {
  userRoles = userRoles.map(role => role.toUpperCase());
  permittedRoles = permittedRoles.map(role => role.toUpperCase());

  if (intersection(userRoles, permittedRoles).length) {
    return true;
  }
  return false;
};
