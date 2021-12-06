import React from 'react';
import Cookies from 'js-cookie';
import Redirect from './Redirect';
import { ACCESS_TOKEN } from '@/src/config/constants';
import { useRouter } from 'next/router';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const token = Cookies.get(ACCESS_TOKEN);
  const currentPath = router?.pathname;

  if (token) {
    if (currentPath === '/') {
      return <Redirect to={'/users'} />;
    }
    return children;
  }
  return <Redirect to={'/login'} />;
};
export default PrivateRoute;
