import React, { FC, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from '../redux/store';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import { appWithTranslation, useTranslation } from 'next-i18next';
import moment from 'moment';

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  const [locale, setLocale] = useState('vi');
  const { i18n } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem('locale')) {
      if (localStorage.getItem('locale') === 'en') {
        setLocale('en');
      } else {
        setLocale('vi');
      }
      if (localStorage.getItem('locale') === 'vi' || localStorage.getItem('locale') === 'en') {
        moment.locale(localStorage.getItem('locale'));
        // i18n && i18n.changeLanguage(localStorage.getItem('locale'));

      }
    } else {
      localStorage.setItem('locale', 'vi');
      moment.locale('vi');
      // i18n && i18n.changeLanguage('vi');
    }
  }, []);

  useEffect(() => {
    if (i18n?.changeLanguage) {
      if (localStorage.getItem('locale')) {
        i18n.changeLanguage(localStorage.getItem('locale'));
      } else {
        i18n.changeLanguage('vi');
      }
    }
  }, [i18n?.changeLanguage]);

  useEffect(() => {
    if (locale !== localStorage.getItem('locale')) {
      if (localStorage.getItem('locale') === 'en') {
        setLocale('en');
      } else {
        setLocale('vi');
      }
    }
  });

  return (
    <ConfigProvider locale={locale === 'en' ? enUS : viVN}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
};

export default wrapper.withRedux(appWithTranslation(WrappedApp));
