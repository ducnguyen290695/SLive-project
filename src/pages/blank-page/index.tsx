import React from 'react';
import styles from './index.module.css';
import { WarningOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, USER_ID } from '@/src/config/constants';

const BlankPage = () => {
  const router = useRouter();

  const loginAgain = () => {
    Cookies.get(ACCESS_TOKEN) && Cookies.remove(ACCESS_TOKEN);
    Cookies.get(USER_ID) && Cookies.remove(USER_ID);
    router.push('/login');
  };

  return (
    <div className={styles.blankPage}>
      <div className={styles.warningForm}>
        <div className={styles.warning}>
          <WarningOutlined />
          <p>You don't have permission to use admin page !</p>
        </div>
        <div>
          <Button type="primary" onClick={loginAgain}>
            Login again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
