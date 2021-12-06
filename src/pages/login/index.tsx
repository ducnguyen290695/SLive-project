import React, { useState, useEffect } from 'react';
import { Form, Checkbox, notification, Spin } from 'antd';
import { FacebookOutlined, GoogleOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import styles from './index.module.css';
import FormInput from '@/src/components/FormInput';
import { LOGIN_ID, INPUT_TYPE } from '@/src/config/constants';
import 'react-phone-number-input/style.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import moment from 'moment';

const Login = () => {
  const { i18n, t } = useTranslation(['login', 'common'])
  const [beginLogin, setBeginLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isSignInWithEmail, setIsSignInWithEmail] = useState(false);

  const { facebookLoading, facebookError } = useSelector((state: any) => state.faceBookLogin);
  const { googleLoading, googleError } = useSelector((state: any) => state.googleLogin);
  const { loginLoading, loginError } = useSelector((state: any) => state.login);
  const isLoading = facebookLoading || googleLoading || loginLoading;

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const formFields = [
    {
      type: INPUT_TYPE.PHONE_INPUT,
      formItemOptions: {
        label: t('phone_number'),
        name: 'phone',
        rules: [{ required: true, message: t('require_phone') }],
      },
      inputOptions: {
        placeholder: t('phone_number'),
        defaultCountry: 'VN',
        value: phoneNumber,
        onChange: setPhoneNumber,
        className: styles.phoneCountryInput,
        placeholderColor: '#cecece',
      },
    },

    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: t('password'),
        name: 'password',
        rules: [{ required: true, message: t('require_password') }],
        className: styles.loginLabel,
      },
      inputOptions: {
        placeholder: t('password'),
        type: 'password',
        className: styles.passwordInput,
        addonBefore: <LockOutlined className="site-form-item-icon" />,
      },
    },
  ];


  const formFieldsEmail = [
    {
      type: INPUT_TYPE.INPUT,
      formItemOptions: {
        label: t('email'),
        name: 'email',
        rules: [{ required: true, message: t('require_phone') }, { type: 'email', message: t('email_invalid') }],
      },
      inputOptions: {
        placeholder: t('email'),
        value: phoneNumber,
        onChange: (e) => setPhoneNumber(e.target.value),
        className: styles.phoneCountryInput,
        placeholderColor: '#cecece',
      },
    },
    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: t('password'),
        name: 'password',
        rules: [{ required: true, message: t('require_password') }],
        className: styles.loginLabel,
      },
      inputOptions: {
        placeholder: t('password'),
        type: 'password',
        className: styles.passwordInput,
        addonBefore: <LockOutlined className="site-form-item-icon" />,
      },
    },
  ];

  const googleLoginRequest = res => {
    dispatch({
      type: 'GOOGLE_LOGIN_REQUEST',
      payload: res?.tokenId,
    });
  };

  const onGoogleLoginFailure = err => {
    notification.error({
      message: t('login_gg_failed'),
      description: err,
    });
  };

  const facebookLoginRequest = res => {
    try {
      dispatch({
        type: 'FACEBOOK_LOGIN_REQUEST',
        payload: res?.accessToken,
      });
    } catch (err) {
      notification.error({
        message: t('login_fb_failed'),
        description: err,
      });
    }
  };

  const loginWithPass = values => {
    dispatch({
      type: 'LOGIN_REQUEST',
      payload: {
        ...values,
        [isSignInWithEmail ? 'email' : 'phone']: phoneNumber,
      },
    });
  };

  //On login with pass fail
  useEffect(() => {
    if (loginError && !loginLoading) {
      notification.error({
        message: t('login_failed'),
      });
      dispatch({
        type: 'LOGIN_CLEANUP',
      });
    }
  }, [loginLoading]);

  //On login with FB fail
  useEffect(() => {
    if (facebookError && !facebookLoading) {
      notification.error({
        message: t('login_failed'),
      });
      dispatch({
        type: 'FACEBOOK_LOGIN_CLEANUP',
      });
    }
  }, [facebookLoading]);

  //On login with GG fail
  useEffect(() => {
    if (googleError && !googleLoading) {
      notification.error({
        message: t('login_failed'),
      });
      dispatch({
        type: 'GOOGLE_LOGIN_CLEANUP',
      });
    }
  }, [googleLoading]);

  const handleChangeLocale = async val => {
    localStorage.setItem('locale', val);
    moment.locale(val);
    await i18n.changeLanguage(val);
  };

  useEffect(() => {
    if (i18n?.changeLanguage) {
      if (localStorage.getItem('locale')) {
        i18n.changeLanguage(localStorage.getItem('locale'));
        moment.locale(localStorage.getItem('locale'));
      } else {
        i18n.changeLanguage('vi');
        moment.locale('vi');
        localStorage.setItem('locale', 'vi');
      }
    }
  }, [i18n?.changeLanguage])

  const handleChangeTypeOfLogin = () => {
    form.resetFields();
    setPhoneNumber(undefined);
    setIsSignInWithEmail(!isSignInWithEmail);
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.loginPage}>
        <div className={styles.loginForm}>
          <Form
            layout="vertical"
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={values => loginWithPass(values)}
          >
            <h1>{t('login')}</h1>
            {(isSignInWithEmail ? formFieldsEmail : formFields).map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}
            <Form.Item className={styles.mb5}>
              <div className={styles.checkBoxGroup}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>{t('remember_me')}</Checkbox>
                </Form.Item>

                <span>{t('forgot_password')}</span>
              </div>
            </Form.Item>
            <div className={styles.mb15} onClick={handleChangeTypeOfLogin}>{t(isSignInWithEmail ? 'sign_in_with_phone_number' : 'sign_in_with_email')}</div>
            <Form.Item>
              <button type="submit" className={styles.loginButton}>
                {t('login')}
              </button>
            </Form.Item>

            <div className={styles.socialButtonGroup}>
              <FacebookLogin
                textButton={t('login_with') + ' Facebook'}
                appId={LOGIN_ID.FACEBOOK_ID}
                fields="name,email,picture"
                onClick={() => setBeginLogin(true)}
                callback={
                  beginLogin
                    ? res => {
                      facebookLoginRequest(res);
                    }
                    : null
                }
                cssClass={styles.facebookLoginButton}
                icon={<FacebookOutlined />}
              />

              <GoogleLogin
                clientId={LOGIN_ID.GOOGLE_ID}
                onSuccess={res => {
                  googleLoginRequest(res);
                }}
                onFailure={err => {
                  onGoogleLoginFailure(err);
                }}
                cookiePolicy={'single_host_origin'}
                render={({ onClick }) => (
                  <button onClick={onClick} className={styles.googleLoginButton}>
                    <GoogleOutlined /> {t('login_with') + ' Google'}
                  </button>
                )}
              />
            </div>
            <div className={styles.selectLocale}>
              <div className={i18n?.language === 'vi' ? styles.activeFlag : styles.defaultFlag}>
                <Image src={'/vi.png'} className={styles.flags} onClick={() => handleChangeLocale('vi')} alt='logo locale'
                       width={35} height={25} />
              </div>
              <div className={i18n?.language === 'en' ? styles.activeFlag : styles.defaultFlag}>
                <Image src={'/en.png'} className={styles.flags} onClick={() => handleChangeLocale('en')} alt='logo locale'
                       width={35} height={25} />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default Login;
