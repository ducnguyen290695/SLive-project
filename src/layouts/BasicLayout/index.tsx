import React, { useState, ReactChild, ReactChildren, useEffect } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Spin,
  Button,
  Avatar,
  Dropdown,
  Space,
  Form,
  Select,
  notification,
} from 'antd';
import { useRouter } from 'next/router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, USER_ID, DATE_FORMAT_API } from '@/src/config/constants';
import { useTranslation, withTranslation } from 'next-i18next';

import routes from '../../config/routes';
import styles from './index.module.css';
import Image from 'next/image';
import PrivateRoute from '@/src/components/PrivateRoute';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import Stack from '@/src/components/Stack';
import { FORM_LAYOUT, INPUT_TYPE, GENDER, DATE_FORMAT } from '@/src/config/constants';
import FormInput from '@/src/components/FormInput';
import { disabledDatePicker } from '@/src/utils/sharedUtils';
import { checkRoles } from '@/src/utils/sharedUtils';
import BlankPage from '@/src/pages/blank-page';
import { ROLES } from '@/src/config/constants';

interface PropsInterface {
  children?: ReactChild | ReactChildren;
  breadcrumb?: Array<any>;
  loading?: boolean;
}

const BasicLayout = (props: PropsInterface) => {
  const { children, breadcrumb, loading } = props;

  const { t, i18n } = useTranslation(['user', 'common']);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [avatar, setAvatar] = useState();
  const [avatarImage, setAvatarImage] = useState(null);
  const [cover, setCover] = useState();
  const [coverImage, setCoverImage] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { user_role } = useSelector((state: RootState) => state.login);
  const { data } = useSelector((state: RootState) => state?.currentUserReducer?.fetchCurrentUser);
  const updateCurrentUser = useSelector(
    (state: RootState) => state?.currentUserReducer?.updateCurrentUser,
  );
  const updateAvatar = useSelector((state: RootState) => state?.currentUserReducer?.updateAvatar);
  const updateCover = useSelector((state: RootState) => state?.currentUserReducer?.updateCover);
  const fetchAddress = useSelector((state: RootState) => state?.commonReducer?.fetchAddress);

  const userRoles = (user_role || []).map(item => item?.role);

  const { Header, Sider, Content, Footer } = Layout;
  const { SubMenu } = Menu;

  const profileMenus = (
    <Menu>
      <Menu.Item onClick={openProfileStack}>
        <UserOutlined />
        Profile
      </Menu.Item>
      <Menu.Item onClick={logout}>
        <ExportOutlined />
        {t('common:log_out')}
      </Menu.Item>
    </Menu>
  );

  const formFields = [
    {
      type: INPUT_TYPE.IMAGE_UPLOAD,
      formItemOptions: {
        label: `${t('avatar')}`,
      },
      inputOptions: {
        listType: 'picture-card',
        showUploadList: false,
        getFile: file => setAvatar(file),
        imageUrl: avatarImage,
        setImageUrl: setAvatarImage,
        onChange: uploadAvatar,
        accept: 'image/png, image/jpeg, image/jpg, image/svg+xml, image/pjpeg, image/webp',
      },
    },
    {
      type: INPUT_TYPE.IMAGE_UPLOAD,
      formItemOptions: {
        label: `${t('cover')}`,
      },
      inputOptions: {
        listType: 'picture-card',
        showUploadList: false,
        getFile: file => setCover(file),
        imageUrl: coverImage,
        setImageUrl: setCoverImage,
        onChange: uploadCover,
        accept: 'image/png, image/jpeg, image/jpg, image/svg+xml, image/pjpeg, image/webp',
      },
    },
    {
      formItemOptions: {
        label: t('common:name'),
        name: 'name',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('common:name'),
      },
    },
    {
      formItemOptions: {
        label: 'Nick Name',
        name: 'nickname',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: 'Nick Name',
      },
    },
    {
      type: INPUT_TYPE.DATE_PICKER,
      formItemOptions: {
        label: t('birthday'),
        name: 'birthday',
        rules: [{ required: true, message: t('common:please_select_time') }],
      },
      inputOptions: {
        placeholder: t('birthday'),
        format: DATE_FORMAT,
        disabledDate: disabledDatePicker,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('gender'),
        name: 'gender_id',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('gender'),
        options: [
          {
            label: t(`${GENDER.MALE.LABEL}`),
            value: 1,
          },
          {
            label: t(`${GENDER.FEMALE.LABEL}`),
            value: 0,
          },
        ],
      },
    },
    {
      formItemOptions: {
        label: t('phone_number'),
        name: 'phone',
      },
      inputOptions: {
        placeholder: t('phone_number'),
        readOnly: true,
      },
    },
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
        rules: [
          { required: true, message: t('common:require_field') },
          { type: 'email', message: t('common:email_invalid') },
        ],
      },
      inputOptions: {
        placeholder: 'Email',
      },
    },

    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('address'),
        name: 'address',
      },
      inputOptions: {
        placeholder: t('address'),
        options: fetchAddress?.data?.data.map((item, index) => {
          return {
            label: item.province,
            value: index,
          };
        }),
      },
    },
  ];

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const routeToPath = (path: string) => {
    router.push(path);
  };

  function logout() {
    Cookies.get(ACCESS_TOKEN) && Cookies.remove(ACCESS_TOKEN);
    routeToPath('/login');
  }

  function openProfileStack() {
    const { birthday, gender_id } = data.data;
    setAvatarImage(data?.data?.avatar);
    setCoverImage(data?.data?.cover);
    setIsStackOpen(true);
    form.setFieldsValue({
      ...data?.data,
      birthday: birthday ? moment(birthday, DATE_FORMAT) : '',
      gender_id: gender_id === 0 ? GENDER.FEMALE.VALUE : GENDER.MALE.VALUE,
    });
  }

  function updateProfile(values) {
    console.log({ values });
    const payload = {
      ...values,
      birthday: moment(values.birthday).format(DATE_FORMAT_API),
      address: getAddressByIndex(values.address),
    };
    dispatch({
      type: 'UPDATE_CURRENT_USER_REQUEST',
      payload,
    });
  }

  function uploadCover() {
    const formData = new FormData();
    formData.append('image', cover);
    dispatch({
      type: 'UPDATE_COVER_REQUEST',
      payload: formData,
    });
  }

  function uploadAvatar() {
    const formData = new FormData();
    formData.append('image', avatar);
    dispatch({
      type: 'UPDATE_AVATAR_REQUEST',
      payload: formData,
    });
  }

  const getActiveKey = () => {
    const currentPath = router?.pathname;
    let defaultOpenKey = '';
    let currentActiveKey = '';
    for (let item of routes) {
      if (item.children) {
        for (let child of item.children) {
          if (currentPath === child.path) {
            currentActiveKey = (child as any).key;
            defaultOpenKey = item.key;
          }
        }
      } else {
        if (currentPath === item.path) {
          currentActiveKey = item.key;
        }
      }
    }
    return {
      currentActiveKey,
      defaultOpenKey,
    };
  };

  const getAddressByIndex = index => {
    let address = fetchAddress.data.data;
    let result = '';
    for (let i = 0; i < address.length; i++) {
      if (i === index) {
        result = address[i].province;
        break;
      }
    }
    return result;
  };

  const getCurrentUser = () => {
    dispatch({
      type: 'FETCH_CURRENT_USER_REQUEST',
    });
  };

  const getAddress = () => {
    dispatch({
      type: 'FETCH_ADDRESS_REQUEST',
    });
  };

  const getUserRole = () => {
    dispatch({
      type: 'GET_USER_ROLE',
      payload: Cookies.get(USER_ID),
    });
  };

  // On upload cover success
  useEffect(() => {
    if (!updateCover.updating && updateCover.updateSuccess) {
      getCurrentUser();
    }
  }, [updateCover.updating]);

  // On upload cover fail
  useEffect(() => {
    if (!updateCover.updating && updateCover.updateError) {
      notification.error({
        message: t('upload_cover_fail'),
      });
      setCoverImage(data.data.cover);
      dispatch({
        type: 'UPDATE_COVER_CLEANUP',
      });
    }
  }, [updateCover.updating]);

  // On upload avatar success
  useEffect(() => {
    if (!updateAvatar.updating && updateAvatar.updateSuccess) {
      getCurrentUser();
    }
  }, [updateAvatar.updating]);

  // On upload avatar fail
  useEffect(() => {
    if (!updateAvatar.updating && updateAvatar.updateError) {
      notification.error({
        message: t('upload_avatar_fail'),
      });
      setAvatarImage(data.data.avatar);
      dispatch({
        type: 'UPDATE_AVATAR_CLEANUP',
      });
    }
  }, [updateAvatar.updating]);

  // On update current user success
  useEffect(() => {
    if (!updateCurrentUser.updating && updateCurrentUser.updateSuccess) {
      notification.success({
        message: t('update_profile_success'),
      });
      getCurrentUser();
      setIsStackOpen(false);
    }
  }, [updateCurrentUser.updating]);

  // On update current user fail
  useEffect(() => {
    if (!updateCurrentUser.updating && updateCurrentUser.updateError) {
      notification.error({
        message: t('update_profile_fail'),
      });
      dispatch({
        type: 'UPDATE_CURRENT_USER_CLEANUP',
      });
    }
  }, [updateCurrentUser.updating]);

  useEffect(() => {
    setIsMobile(screen.width < 767 ? true : false);
    screen.width < 767 && setCollapsed(true);
    getUserRole();
    getCurrentUser();
    getAddress();
  }, []);

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
  }, [i18n?.changeLanguage]);

  const handleChangeLocale = async val => {
    localStorage.setItem('locale', val);
    moment.locale(val);
    await i18n.changeLanguage(val);
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        style={
          isMobile
            ? {
                marginLeft: collapsed ? '-300px' : '0',
              }
            : null
        }
      >
        <div className={styles.logo}>
          <Image src={'/logo-Slive.svg'} alt="logo" width={34} height={34} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          className={styles.mainMenu}
          selectedKeys={[getActiveKey().currentActiveKey]}
          defaultOpenKeys={[getActiveKey().defaultOpenKey]}
        >
          {routes.map((item: any) => {
            if (item.children) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={t(`common:${item.title}`)}>
                  {item.children &&
                    item.children.map(child => {
                      if (child?.accessRoles) {
                        if (checkRoles({ userRoles, permittedRoles: child?.accessRoles })) {
                          return (
                            <Menu.Item
                              onClick={() => {
                                routeToPath((child as any).path);
                              }}
                              key={child.key}
                            >
                              {t(`common:${child.title}`)}
                            </Menu.Item>
                          );
                        }
                        return;
                      } else
                        return (
                          <Menu.Item
                            onClick={() => {
                              routeToPath((child as any).path);
                            }}
                            key={child.key}
                          >
                            {t(`common:${child.title}`)}
                          </Menu.Item>
                        );
                    })}
                </SubMenu>
              );
            }

            if (item?.accessRoles) {
              if (checkRoles({ userRoles, permittedRoles: item?.accessRoles })) {
                return (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={() => {
                      routeToPath(item.path);
                    }}
                    style={{ margin: 0, height: 50, display: 'flex', alignItems: 'center' }}
                  >
                    {t(`common:${item.title}`)}
                  </Menu.Item>
                );
              }
              return;
            } else
              return (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={() => {
                    routeToPath(item.path);
                  }}
                  style={{ margin: 0, height: 50, display: 'flex', alignItems: 'center' }}
                >
                  {t(`common:${item.title}`)}
                </Menu.Item>
              );
          })}
        </Menu>

        <div className={styles.localeContainer}>
          <div className={styles.selectLocale}>
            <div className={i18n?.language === 'vi' ? styles.activeFlag : styles.defaultFlag}>
              <Image
                src={'/vi.png'}
                className={styles.flags}
                onClick={() => handleChangeLocale('vi')}
                alt="logo locale"
                width={35}
                height={25}
              />
            </div>
            <div className={i18n?.language === 'en' ? styles.activeFlag : styles.defaultFlag}>
              <Image
                src={'/en.png'}
                className={styles.flags}
                onClick={() => handleChangeLocale('en')}
                alt="logo locale"
                width={35}
                height={25}
              />
            </div>
          </div>
        </div>
      </Sider>

      <Layout className="site-layout">
        <Header
          className={styles.header}
          style={
            isMobile
              ? null
              : {
                  marginLeft: collapsed ? '80px' : '200px',
                }
          }
        >
          <div className={styles.headerContent}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
            <div className={styles.rightHeader}>
              <Dropdown
                overlayClassName={styles.profileDropDown}
                overlay={profileMenus}
                placement="bottomLeft"
              >
                <div>
                  <Avatar src={data?.data?.avatar} className={styles.avatarDropDown} />
                  <span className={styles.currentUserName}>{data?.data?.name || ''}</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        {breadcrumb && (
          <Breadcrumb
            className={styles.breadCrumb}
            style={isMobile ? null : { marginLeft: collapsed ? '80px' : '200px' }}
          >
            {breadcrumb.map((item, index) => (
              <Breadcrumb.Item
                key={index}
                className={item.link ? styles.breadCrumbItem : ''}
                onClick={() => {
                  routeToPath(item.link);
                }}
              >
                {item.name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}

        <PrivateRoute>
          <Content
            className={styles.content}
            style={
              isMobile
                ? null
                : {
                    marginLeft: collapsed ? '100px' : '215px',
                  }
            }
          >
            <Spin spinning={loading ? loading : false}>{children}</Spin>
          </Content>
        </PrivateRoute>

        {!collapsed && <div className={styles.maskLayer} onClick={() => setCollapsed(true)}></div>}

        <Footer className={styles.footer} style={{ marginLeft: collapsed ? '100px' : '215px' }}>
          Copyright © 2021 SLive All Rights Reserved.
        </Footer>
      </Layout>

      <Stack
        isStackOpen={isStackOpen}
        setIsStackOpen={setIsStackOpen}
        width={isMobile ? '100vw' : '600px'}
        title={t('update_profile')}
      >
        <Form {...FORM_LAYOUT} form={form} onFinish={values => updateProfile(values)}>
          {formFields.map((field, index) => {
            return <FormInput key={index} {...field} />;
          })}
          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common:save')}
              </Button>
              <Button onClick={() => setIsStackOpen(false)}>{t('common:cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Stack>
    </Layout>
  );
};

export default withTranslation()(BasicLayout);
